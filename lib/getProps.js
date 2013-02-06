module.exports = getProps

function getProps(program) {
	var props = {
		key: program.key || process.env.AWS_ACCESS_KEY_ID,
		secret: program.secret || process.env.AWS_SECRET_ACCESS_KEY,
		bucket: program.bucket || process.env.S3_BUCKET
	}

	return props
}
