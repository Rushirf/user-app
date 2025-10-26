
const cloudinary = require('cloudinary').v2;

cloudinary.config({ secure: true });

const cloudinaryUpload = async (publicId, file) => {
	const result = await cloudinary.uploader.upload(file.path, {
		resource_type: "auto",
		public_id: publicId,
		unique_filename: false,
		overwrite: true,
	});


	return result.secure_url;
};

module.exports = {
	cloudinaryUpload,
};