# Socket Cam

- スマートフォンを、簡単に監視カメラ代わりにすることができるサービスです。
- ホームページ: https://socket-cam.net/


## 利用技術
- フロントエンド
    * React, TypeScript, Chakra UI, Tailwindcss

- バックエンド
    * SkyWay


## チュートリアル

1. ホームページにアクセスし、`ダッシュボードに移動`をクリックします。
    * ![スクリーンショット 2022-02-25 171837](https://user-images.githubusercontent.com/31305419/155680113-f94db6d3-7a28-441e-9730-59da01ddd976.png)

2. ダッシュボードは下記画像のようになっています。右上にある`カメラ追加`をクリックするとQRコードとURLリンクが表示されます。
    * ![スクリーンショット 2022-02-25 171944](https://user-images.githubusercontent.com/31305419/155680607-9ebb33e6-3cff-4ad1-b5e2-c6f2a7731fcb.png)

3. そのURLまたはQRコードを、監視カメラにしたい端末に読み取らせ、リンク先にアクセスしてください。

4. アクセスすると、「カメラ・マイクへのアクセス許可」に関するポップが表示されますので、許可してください。
    * ![スクリーンショット 2022-02-25 172515](https://user-images.githubusercontent.com/31305419/155681062-9c10d658-bf8e-401d-8367-813d0b8961b2.png)

5. 許可をするとルームに接続され、ダッシュボード上でカメラ映像が表示されます。
    * ![スクリーンショット 2022-02-25 172608](https://user-images.githubusercontent.com/31305419/155681194-be861668-1fca-4841-9cbf-f15a0ee1b326.png)

6. カメラを削除する場合は、アクションボタン内にある`カメラを削除`をクリックすると、カメラが解除されます。(カメラ側は、ホームページに遷移します)
    * ![スクリーンショット 2022-02-25 172737](https://user-images.githubusercontent.com/31305419/155681417-08d4fcdd-bfe2-4a10-96b9-fd0b2ade3f76.png)

7. ダッシュボードを削除したい場合は、右上にある`アクション`ボタン内にある`ダッシュボードを削除`をクリックすると、削除されます。(削除後はホームページに遷移します)
    * ![スクリーンショット 2022-02-25 173213](https://user-images.githubusercontent.com/31305419/155682069-84317591-d5da-45ab-94c6-8fbd2ba5ad3d.png)

# ダッシュボード機能

## カメラの機能紹介

![スクリーンショット 2022-02-25 173515](https://user-images.githubusercontent.com/31305419/155682512-d8c13372-376c-4918-9b8f-3932943d27bf.png)

### モーション検知・通知
- `モーション検知`: 物体が動いたかどうかを検知します
    * `検知した場合、通知する`: モーション検知した場合、デスクトップに通知します。(PCのみ)
    * `検知した場合、通知内容を送信する`: 通知内容を入力欄に書かれた内容をカメラに送信します。

- 通知内容を送信: `通知内容を入力`欄に入力された通知を送信します。送信された通知内容は、カメラ側で読み上げられます。
    * iPhoneなどのSafariでは、`アクション`ボタン内にある`スピーカーを許可`をクリックする必要があります。

### カメラ
- カメラを切り替えることができます。

### アクション
- `検知した画像を見る`: モーション検知した際に撮影された画像の一覧が表示されます。
- `スクリーンショット`: 現在撮影されている映像のスクリーンショットを撮影します。
- `拡大`: 表示領域を拡大します
- `カメラ再読み込み`: 映像を撮影しているブラウザのページ再読み込みをします。
- `カメラを削除`: カメラの撮影を停止し、ダッシュボードから削除されます。
- また、デフォルトでは`新規のダッシュボードさん`となっていますが、そのテキストをクリックするとダッシュボード名の変更もできます。

## ダッシュボードの機能紹介
![image](https://user-images.githubusercontent.com/31305419/155684786-8709866d-d537-4ad0-81ac-9153e71424ae.png)

### アクション
- `ホームに戻る`: ホームページに遷移します。
- `ダッシュボードを共有`: このダッシュボードを共有することができます。
- `サーバーに再接続`: ブラウザのページを再読み込みします。
- `ダッシュボード削除`: ダッシュボードを削除します。削除された場合、カメラはすべて破棄されホームページに遷移します。

### カメラ追加
- 端末を監視カメラとして追加できるリンクとQUコード生成します。


# カメラ機能
![スクリーンショット 2022-02-25 175652](https://user-images.githubusercontent.com/31305419/155685646-8f7c8471-81df-434b-b835-4522a70a61d3.png)

### アクション
- `カメラを増やす`: 同じダッシュボードに接続することができる監視カメラのリンク・QUコードを共有することができます。
- `スピーカーを許可`: 通知が送信されたときに、スピーカーから音を出すことを許可します。(Safariのみ許可が必要)
- `サーバーに再接続`: ブラウザのページを再読み込みします。
- `カメラを切断`: カメラを削除します。ダッシュボード上からは削除され、ホームページに遷移します。

### カメラ
- 撮影するカメラを選択します。



