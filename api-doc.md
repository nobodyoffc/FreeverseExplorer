
-------------------------------------------
# General API
-------------------------------------------
## ping
* path: /APIP/v1/ping
* Test API connectivity and get the height and blockId of the best block in the server

<br>
## getService
* path: /APIP/v1/getService
* Get the API service information and status

<br>
## chainInfo
* path: /APIP/sn2/v1/chainInfo
* Get the information of the Freecash blockchain

<br>
## blockByHeights
* path: /APIP/sn2/v1/blockByHeights
* parameters: terms=1,height,height1,height2
* Get block information by block heights

<br>
## bestBlock
* path: /APIP/sn2/v1/bestBlock
* Get the best (latest) block information

<br>
## richlist
* path: /APIP/richlist
* Get the list of richest addresses (optional parameter: number, default 100)
<br>
-------------------------------------------
# Wallet API
-------------------------------------------
<br>
## broadcastTx
* path: /APIP/sn18/v1/broadcastTx
* parameter: rawTx=txhex
* Broadcast a raw transaction to the network

<br>
## cashValid
* path: /APIP/sn18/v1/cashValid
* parameter for all UTXO: fid=addr
* paramater for pay: fid=addr&amount=1.12345678
* Get valid cash (UTXO) information with filtering options

<br>
## txByIds
* path: /APIP/sn2/v1/txByIds
* parameter: ids=txid1,txid2
* Get transaction information by transaction IDs

<br>
## txByFid
* path: /APIP/sn2/v1/txByFid
* paramater: terms=2,inMarks.owner,outMarks.owner,addr
* Get transactions by FID (Freecash ID)
<br>
-------------------------------------------
# CID API
-------------------------------------------
<br>
## cidInfoByIds
* path: /APIP/sn3/v1/cidInfoByIds
* paramater: ids=addr1,addr2
* Get all the CID information by FIDs

<br>
## cidByIds
* path: /APIP/sn3/v1/cidByIds
* paramater: ids=addr1,addr2
* Get FID-CID map by FIDs

<br>
## avatars
* path: /APIP/sn3/v1/avatars
* paramater: ids=addr1,addr2
* Get FID-avatar map by FIDs
<br>
-------------------------------------------
# Response fields
-------------------------------------------
* **data**: the requested data 
* **code**: The state code of the response. 0 is for success.
* **message**: The state message of the response.
* **got**: How many objects are got in data.
* **total**: Hom many objects are hitted by the request.
* **bestHeight**: the best height when this reponse was made.
* **bestBlockId**: the best block ID which can be used with the bestHeight to check rollback.
For signed request:
* **nonce**: the same nonce of the signed request.
* **time**: the time of the response being created.
* **balance**: the satoshi balance of the requester.