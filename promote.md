
请创建一个iphone App 'EasyQR'，它从上到下包含3个区域：
	1. 扫描窗口区
		1. 默认状态：黑色背景，提示词：“请点击’Scan‘进行扫描”。
		2. 当‘Scan’被点击，相机打开进行扫描时，此区域显示相机捕捉到的动态画面。
		3. 每当二维码被识别时，此区域恢复到默认状态。
		4. 右下角有一个‘image’图标，点击它可以从相册中选择二维码图片进行识别。
	2. 可编辑文本区
		1. 显示二维码识别的结果，并保持可编辑状态。
		2. 当本区域已有内容时，新的二维码内容追加到已存在内容的尾部，不插入任何字符。
	3. 按钮区
		1. ‘Make’ 按钮。
			1. 被点击则将文本区的所有内容制作成一个或多个二维码。当文本转换成字节数组后超过400字节时，对数组进行拆分，每400字节制作成一个二维码。
			2. 用一个弹窗显示这些二维码，每个二维码底部标注 '<当前序号>/<总数量>'，用户通过左右滑动显示其他二维码。
			3. 弹窗的底部有两个按钮：'Save' 点击保存所有二维码到相册；'OK' 返回主页面。
		2. 'Clear' 按钮。点击清空文本区。
		3. 'Copy' 按钮。点击复制文本区内容到粘贴板
		4. 'Scan' 按钮。点击开始扫描。
该应用需要相机权限和存储权限。
		



I want to create a website to show the data from some APIs.
1. data card
2. structure
	1. blockchain
		1. chain: chainInfo, BlockTimeHistory, difficultyHistory, HashRatehistory
		2. block
		3. tx
		4. cash
		5. OpReturn
	2. Identity
		1. cid
		2. nobody
		3. multisign
		4. nid
	3. Construct
		1. protocol
		2. code
		3. service
		4. app
	4. Organization
		1. group
		2. team
	5. Personal
		1. mail
		2. contact
		3. secret
		4. box
	6. Publish
		1. statement
		2. essay
		3. report
		4. paper
		5. book
		6. artwork
		7. remark
	7. Finance
		1. proof
		2. token
	8. Tools


# add FEIP

## promote
```
I want to add a new category of 'Artwork' in FEIP and APIP based on category of 'Report'. Please: 
1) add Artwork.java, ArtworkHistory.java and ArtworkOpData.java based on responding Report classes. 
2) add indices handler logic  and string values in @IndicesFEIP.java , @IndicesNames.java and @ApipApiNames.java . 
3) add parser and rollbacker in @PublishParser.java and @PublishRollbacker.java . Call them in @FileParser.java . 
4) add the methods and cases in @FeipClient.java and @StartFeipClient.java . 
5) add the mehods and cases in @ApipClient.java and @StartApipClient.java .


I added a new category of 'Artwork' in FEIP based on category of 'Report'. Please: 
1)add the package 'APIP25V1_Artwork' and the classes with sn 25 in it.
2) add the mehods and cases in @ApipClient.java and @StartApipClient.java .
```
    
