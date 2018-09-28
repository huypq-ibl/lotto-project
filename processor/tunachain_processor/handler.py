import logging
import hashlib

import json


from sawtooth_sdk.processor.handler import TransactionHandler
from sawtooth_sdk.processor.exceptions import InvalidTransaction
from sawtooth_sdk.processor.exceptions import InternalError


LOGGER = logging.getLogger(__name__)


VALID_ACTIONS = ('buy',)

# MIN_VALUE = 0
# MAX_VALUE = 4294967295
# MAX_NAME_LENGTH = 20

FAMILY_NAME = 'lotto'

LOTTO_ADDRESS_PREFIX = hashlib.sha512(
    FAMILY_NAME.encode('utf-8')).hexdigest()[0:6]

def make_lotto_address(signer):
    return LOTTO_ADDRESS_PREFIX + hashlib.sha512(
        signer.encode('utf-8')).hexdigest()[-64:]

class LottoTransactionHandler(TransactionHandler):
    @property
    def family_name(self):
        return FAMILY_NAME

    @property
    def family_versions(self):
        return ['1.0']

    @property
    def namespaces(self):
        return [LOTTO_ADDRESS_PREFIX]
    
    def apply(self, transaction, context):
        action, signer, value = _unpack_transaction(transaction)
        print('Da unpacket\n')
        print(action, signer, value)
       
        state = _get_state_data(signer, context)
        
        updated_state = _do_lotto(action, signer, value, state)

        _set_state_data(signer, updated_state, context)

def _unpack_transaction(transaction):
    action, signer, value = _decode_transaction(transaction)

    _validate_action(action)
    _validate_signer(signer)
    _validate_value(value)

    return action, signer, value

def _decode_transaction(transaction):
    try:
        content = json.loads(transaction.payload.decode('utf-8'))
    except:
        raise InvalidTransaction('Invalid payload serialization')
    
    try:
        action = content['Action']
    except AttributeError:
        raise InvalidTransaction('Action is required')
    
    try:
        signer = content['Signer']
    except AttributeError:
        raise InvalidTransaction('Signer is required')
    
    try:
        value = content['Value']
    except AttributeError:
        raise InvalidTransaction('Value is required')

    return action, signer, value

def _validate_action(action):
    if action not in VALID_ACTIONS:
        raise InvalidTransaction('Action must be "buy"')

def _validate_signer(signer):
    return

def _validate_value(value):
    return

# def _validate_name(name):
#     if not isinstance(name, str) or len(name) > MAX_NAME_LENGTH:
#         raise InvalidTransaction(
#             'Name must be a string of no more than {} characters'.format(
#                 MAX_NAME_LENGTH))


# def _validate_value(value):
#     if not isinstance(value, int) or value < 0 or value > MAX_VALUE:
#         raise InvalidTransaction(
#             'Value must be an integer '
#             'no less than {i} and no greater than {a}'.format(
#                 i=MIN_VALUE,
#                 a=MAX_VALUE))

def _get_state_data(signer, context):
    address = make_lotto_address(signer)

    state_entries = context.get_state([address])

    try:
        return json.loads(state_entries[0].data.decode('utf-8'))
    except IndexError:
        return {}
    except:
        raise InternalError('Failed to load state data')

def _set_state_data(signer, state, context):
    address = make_lotto_address(signer)

    encoded = json.dumps(state).encode('utf-8')

    addresses = context.set_state({address: encoded})

    if not addresses:
        raise InternalError('State error')

def _do_lotto(action, signer, value, state):
    actions = {
        'buy': _do_buy,
    }

    try:
        return actions[action](signer, value, state)
    except KeyError:
        # This would be a programming error.
        raise InternalError('Unhandled action: {}'.format(action))

def _do_buy(signer, value, state):
    msg = 'Signer {s} buys a lotto ticket {v}'.format(s=signer, v=value)
    LOGGER.debug(msg)

    updated = {k:v for k, v in state.items()}

    if signer not in state:
        updated[signer] = [value]
    else:
        updated[signer].append(value)

    return updated
    

