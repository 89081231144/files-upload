const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(fileUpload({
	createParentPath: true
}));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const port = process.env.PORT || 3000;

app.use(express.static('public'));

app.post('/upload-files', async (req, res) => {
	try {
		if(!req.files) {
			res.send({
				status: false,
				message: 'No file uploaded'
			});
		} else {
			const data = [];
			const uploadFiles = req.files.uploadFiles;
			if(Array.isArray(uploadFiles))
			{
				uploadFiles.forEach(file => {
						const { name, mimetype, size } = file;
						file.mv(`./public/uploads/${name}`);
						data.push({ name, mimetype, size });
				});
			} else {
				const { name, mimetype, size } = uploadFiles;
				uploadFiles.mv(`./public/uploads/${name}`);
				data.push({ name, mimetype, size });
			}
			res.send({
				status: true,
				message: 'Files are uploaded',
				data,
			});
		}
	} catch (err) {
		res.status(500).send(err);
	}
});
app.listen(port, () =>
	console.log(`App is listening on port ${port}.`)
);
