const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cheerio = require('cheerio');
const app = express();

app.use(bodyParser.json());

app.post('/webhook', (req, res) => {
  const { body } = req;
  const jsonBody = JSON.stringify(body, null, 2);

  fs.readFile('./index.html', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error updating page');
    }
    const $ = cheerio.load(data);

    const contentDiv = $('#content');
    contentDiv.append(`${new Date()}\n<pre>${jsonBody}</pre>`);

    fs.writeFile('./index.html', $.html(), 'utf8', (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating page');
      }

      res.send('Page updated successfully');
    });
  });
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server is running...');
});