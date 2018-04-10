# Cognitive_Faceidentify

透過微軟認知服務建置人臉識別系統。
微軟在雲端服務中推出了Cognitive Server，其中包含了Face API這個服務功能，其主要的效用就是可以透過照片進行人臉的比對與辨識。

Face API 名詞解釋：
![Face API 名詞解釋](https://i.imgur.com/qemnoE5.png)
首先建立一個PersonGroup，在這個PersonGroup中，可以加入多個Person，而一個Person又可以加入多個Face；換句話說，PersonGroup也就是前面所提到的人員清單，裡面的Person就是每一個人員，而每個人又可以提供不同角度的照片作為辨識的依據。

下面將說明Face API使用步驟：  

### 申請試用認知服務 API

到Microsoft的[試用認知服務](https://azure.microsoft.com/zh-tw/try/cognitive-services/?api=face-api)網頁去申請一組試用金鑰，在**人臉識別 API**的項目上點選`取得金鑰`，登入帳戶後即可取得一組免費金鑰。
> 每一個帳戶只能建立一個免費的Face API

### 
> 本範例使用到WebRTC

> 先**Detect**照片中的人臉，再**Identify**這個人臉屬於PersonGroup中哪一個Person。