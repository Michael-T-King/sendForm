"use strict";

const formData = require('form-data');
const Mailgun = require('mailgun.js');
const mailgun = new Mailgun(formData);

const apiKey = process.env.MAILGUN_API_KEY; // Ваш API-ключ
const domain = process.env.MAILGUN_DOMAIN; // Ваш домен

if (!apiKey || !domain) {
  throw new Error('API ключ и домен должны быть указаны в переменных окружения');
}

const mg = mailgun.client({ username: 'api', key: apiKey });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log('Received POST request with body:', req.body);
    
    const { name, email, phone, selectedCheckboxes, agreevment } = req.body;

    const body = `
      <h1>Новое письмо от:</h1>
      <p><strong>Имя:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Телефон:</strong> ${phone}</p>
      <p><strong>Чекбоксы:</strong> ${selectedCheckboxes ? selectedCheckboxes.join(', ') : 'Нет'}</p>
      <p><strong>Согласие на обработку персональных данных:</strong> ${agreevment ? 'Да' : 'Нет'}</p>
    `;

    const msg = {
      from: 'm.tech.05.michael@gmail.com',
      to: 'michaeltitarenko@gmail.com',
      subject: 'Новая обратная связь',
      html: body,
    };

    try {
      console.log('Отправка письма:', msg);
      await mg.messages.create(domain, msg);
      res.status(200).json({ message: 'Письмо успешно отправлено!' });
    } catch (error) {
      console.error('Ошибка при отправке письма:', error);
      res.status(500).json({ error: 'Ошибка при отправке письма', details: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
