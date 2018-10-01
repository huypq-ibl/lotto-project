import os

from threading import Thread

# 'fileExecute filePath url numberTransactionPerSecond'
entries = [
    'sendTx.js ./batchList0.txt http://139.162.47.17:8008/batches 100',
    'sendTx.js ./batchList1.txt http://139.162.47.17:8008/batches 100',
    'sendTx.js ./batchList2.txt http://139.162.47.17:8008/batches 100',
    'sendTx.js ./batchList3.txt http://139.162.47.17:8008/batches 100'
]

def exe(cmd):
    os.system(cmd)

try :
    t0 = Thread(target = exe, args = ('node ' + entries[0], ))
    t1 = Thread(target = exe, args = ('node ' + entries[1], ))
    t2 = Thread(target = exe, args = ('node ' + entries[2], ))
    t3 = Thread(target = exe, args = ('node ' + entries[3], ))

    t0.start()
    t1.start()
    t2.start()
    t3.start()

    t0.join()
    t1.join()
    t2.join()
    t3.join()
except:
    print("Error ...")