const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());  // JSONデータを受け取るためのミドルウェア

// 発行用のエンドポイント（番号生成）
app.post('/register', (req, res) => {
  const { number, expiry } = req.body;
  const line = `${number},${expiry}\n`;
  
  // data.txt に保存
  fs.appendFile('data.txt', line, err => {
    if (err) return res.status(500).send('保存エラー');
    res.send('保存完了');
  });
});

// チェック用のエンドポイント（番号確認）
app.post('/verify', (req, res) => {
  const { number } = req.body;
  const today = new Date().toISOString().split('T')[0];  // 今日の日付（YYYY-MM-DD形式）

  // data.txt から番号を探す
  fs.readFile('data.txt', 'utf8', (err, data) => {
    if (err) return res.status(500).send('読み込みエラー');

    const lines = data.trim().split('\n');
    const match = lines.find(line => {
      const [n, expiry] = line.split(',');
      return n === number && expiry >= today;  // 番号と有効期限のチェック
    });

    if (match) {
      res.send('✅ 有効な番号です');
    } else {
      res.send('❌ 無効な番号、または有効期限切れです');
    }
  });
});

// サーバーを3000番ポートで起動
app.listen(PORT, () => {
  console.log(`サーバーが http://localhost:${PORT} で起動しました`);
});
