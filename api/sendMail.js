const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({username: 'api', key: process.env.MAILGUN_API_KEY});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, phone, checkbox1, checkbox2, checkbox3, checkbox4, agreevment } = req.body;

    const body = `
      <h1>Новое письмо от:</h1>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Чекбоксы:</strong> ${[checkbox1, checkbox2, checkbox3, checkbox4].filter(Boolean).join(', ')}</p>
      <p><strong>Согласие на обработку персональных данных:</strong> ${agreevment ? 'Да' : 'Нет'}</p>
    `;

    const msg = {
      from: 'your-email@example.com',
      to: 'michaeltitarenko@gmail.com',
      subject: 'Новая обратная связь',
      html: body,
    };

    try {
      await mg.messages.create('YOUR_DOMAIN_NAME', msg);
      res.status(200).json({ message: 'Письмо успешно отправлено!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Ошибка при отправке письма' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
