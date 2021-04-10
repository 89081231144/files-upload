new Vue({
	el: '#app',
	data: {
		uploadMode: 'one',
		files: [],
		host: 'http://localhost:3000',
		uploadRoute: '/upload-files',
		downloadRoute : '/uploads',
		uploadCompleted: false,
	},
	computed: {
		singleFile() {
			return this.uploadMode === 'one';
		},
		uploadBtnText() {
			return this.singleFile ? 'файл' : 'файлы';
		},
		filesNamesToStr(){
			return this.files.map(f=>f.name).join(';');
		},
	},
	methods: {
		onPickFile(){
			this.$refs.fileInput.click();
			},
		addFile(e){
			let pickedFiles = [];
			if(e.target&&e.target.files&&e.target.files.length){
				pickedFiles = e.target.files;
			}
			if(!pickedFiles) return;
			this.files = this.singleFile ? [] : this.files;
			this.uploadCompleted = false;
			([...pickedFiles]).filter(({size})=>size<2007900).forEach(f => {
				this.files.push(f);
			});
		},
		fileHref(fName){
			return `${this.host}${this.downloadRoute}/${fName}`
		},
		removeFile(i) {
			this.files.splice(i, 1);
		},
		upload(){
			if(!this.files.length) return;
			const formData = new FormData();
			const options = {method: 'POST'};
			this.files.forEach(f=>{
				formData.append('uploadFiles', f);
				});
			options.body = formData;
			fetch( `${this.host}${this.uploadRoute}`, options )
				.then( response => this.uploadCompleted = true )
				.catch( response => this.uploadCompleted = false )

		},
	}
});
