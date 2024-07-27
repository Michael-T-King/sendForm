const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: '0f1db83d-0e6ebec8' });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received POST request with body:', req.body);
    
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
      from: 'michaeltitarenko@gmail.comsandboxdc0c79ac17a048029e4f1bbad89e9857.mailgun.org',
      to: 'michaeltitarenko@gmail.comsandboxdc0c79ac17a048029e4f1bbad89e9857.mailgun.org',
      subject: 'Новая обратная связь',
      html: body,
    };
    
    try {
      console.log('отправка письма:', msg);
      await mg.messages.create('sandboxdc0c79ac17a048029e4f1bbad89e9857.mailgun.org', msg);
      res.status(200).json({ message: 'Письмо успешно отправлено!' });
    } catch (error) {
      console.error('Error while sending email:', error);
      res.status(500).json({ error: 'Ошибка при отправке письма', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
