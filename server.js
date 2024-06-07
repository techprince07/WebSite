// 必要なモジュールのインポート
const express = require('express');
const stripe = require('stripe')('YOUR_SECRET_KEY'); // Stripeの秘密キーをここに入れます
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイルの提供（publicディレクトリ内のファイルを提供）
app.use(express.static('public'));

// リクエストのボディをJSON形式で解析
app.use(bodyParser.json());

// Checkoutセッションを作成するエンドポイント
app.post('/create-checkout-session', async (req, res) => {
    const { amount } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'jpy',
                    product_data: {
                        name: 'Donation',
                    },
                    unit_amount: amount,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel.html`,
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating checkout session:', error);
        res.status(500).json({ error: error.message });
    }
});

// サーバーの起動
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
