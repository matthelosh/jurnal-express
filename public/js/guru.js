
$(document).ready(function(){
	var nip = $('#nip').text()
	String.prototype.count=function(s1) { 
	    return Number((this.length - this.replace(new RegExp(s1,"g"), '').length) / s1.length);
	}

	$(document).on('click', '.btnDoAbsen', function(){
		var id = $(this).data('id')
		var rombelId = $(this).data('rombel')
		// alert(id+' | '+rombelId)
		$('#idAbsen').text(id)
		$('#dataJadwal').slideUp()
		$('#doAbsenBox').removeAttr('hidden').slideDown()

		$.ajax({
			type: 'get',
			url: '/xhr/guru/get-siswa-rombel',
			data: {idAbsen: id, rombelId:rombelId},
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			},
			success: function(res) {
				if (res.status == 'sukses'){
					var siswas = res.data
					writeDoAbsenForm(siswas, '#tableDoAbsen', id)
				}


				$('#dataJadwal').slideUp()
				$('#doAbsenBox').slideDown()
			}
		})
	})

	async function writeDoAbsenForm(datas, tableId, idAbsen) {
		var rows
		$('#kodeAbsen').val(idAbsen)
		await datas.forEach((siswa, index) => {
			rows += `<tr>
						<td>${index+1}</td>
						<td>${siswa.nis}</td>
						<td>${siswa.namaSiswa}</td>
						<td>
							<input type="hidden" name="nis[]" value="${siswa.nis}">
							<input type="radio" name="absen-${siswa.nis}" value="h" class="checkme" id="h-${siswa.nis}" data-nis="${siswa.nis}" required>
							<label for="h-${siswa.nis}"> H<span class="hidden-sm">adir</span></label>
						</td>
						<td>
							<input type="radio" name="absen-${siswa.nis}" value="i" class="checkme" id="h-${siswa.nis}" data-nis="${siswa.nis}" required>
							<label for="h-${siswa.nis}"> I<span class="hidden-sm">zin</span></label>
						</td>
						<td>
							<input type="radio" name="absen-${siswa.nis}" value="s" class="checkme" id="h-${siswa.nis}" data-nis="${siswa.nis}" required>
							<label for="h-${siswa.nis}"> S<span class="hidden-sm">akit</span></label>
						</td>
						<td>
							<input type="radio" name="absen-${siswa.nis}" value="a" class="checkme" id="h-${siswa.nis}" data-nis="${siswa.nis}" required>
							<label for="h-${siswa.nis}"> A<span class="hidden-sm">lpa</span></label>
						</td>
						<td>
							<input type="radio" name="absen-${siswa.nis}" value="t" class="checkme" id="h-${siswa.nis}" data-nis="${siswa.nis}" required>
							<label for="h-${siswa.nis}"> T<span class="hidden-sm">elat</span></label>
						</td>

			</tr>`
		})

		$(tableId+' tbody').html(rows)
	}


	$(document).on('submit', '#formDoAbsen', function(e) {
		e.preventDefault()
		var data = $(this).serialize()
		$.ajax({
			type:'post',
			url: '/xhr/guru/do-absen',
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			complete: function(){
				$('#ModalLoader').modal('hide')
			},
			data: data,
			dataType:'json',
			success: function(res){
				if(res.status == 'sukses'){
					// $('#dataJadwal').slideDown()
					// $('#doAbsenBox').slideToggle()
					// window.location.reload()
					alert('Absen sudah diproses. Terima kasih. :)')
					window.location.reload()
					console.log(res)
				} else {
					console.log(res)
				}
			}
		})
	})

	// edit absen
	// $(document).on('click', 'btn-box-tool')
	$(document).on('click', '.btn-box-tool', function(e) {
		e.preventDefault()
		// alert('hi')
		$('#dataJadwal').slideDown()
		$(this).parents('.row').slideUp()
	})
	$(document).on('click', '.btnDetilAbsenku', function(){
		var kodeAbsen = $(this).data('id')
		// alert(kodeAbsen)
		$.ajax({
			url: '/xhr/guru/detil-absenku',
			type: 'get',
			dataType: 'json',
			data: {kode: kodeAbsen},
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			success: function(res) {
				console.log(res.data.length)
				$('#idAbsen').text(kodeAbsen)
				var datas = res.data
				$('#dataAbsen').slideUp()
				$('#editAbsen').slideDown()
				writeTableAbsenku(datas, '#tableEditAbsen')
				getKet(datas)
				$('#ket').html('Keterangan')
				$('#jurnal').html(datas[0].jurnal)
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}

		})

		
	})

	// Fungsi edit absen
	async function getKet(datas){
		jmlSiswa = datas.length
		jmlH = 0
		jmlI = 0
		jmlS = 0
		jmlA = 0
		jmlT = 0
		await datas.forEach(item => {
			(item.ket == 'h') ? jmlH++ : (item.ket == 'i') ? jmlI++ : (item.ket == 's') ? jmlI++ : (item.ket == 'a') ? jmlA++ : jmlT++
		})

		$('#ket').html(`
			<p>Jml Siswa: ${jmlSiswa}</p>
			<p>Hadir: ${jmlH}</p>
			<p>Izin: ${jmlI}</p>
			<p>Sakit: ${jmlS}</p>
			<p>Alpa: ${jmlA}</p>
			<p>Telat: ${jmlT}</p>
		`)
	}
	async function writeTableAbsenku(datas, tableId) {
		var rows
		await datas.forEach((item, index) => {
			rows += `<tr>
						<td>${index+1}</td>
						<td>
							${(item.Siswa)?item.Siswa.nis: item.siswaId}
						</td>
						<td>${(item.Siswa)?item.Siswa.namaSiswa: item.siswaId}</td>
						<td>${item.ket}</td>
						<td>
							
							<form class="editAbsen">
							<select class="form-control ketAbsen" name="ketAbsen" data-kode=${item.kodeAbsen} data-nama=${(item.Siswa)?item.Siswa.namaSiswa:item.siswaId} data-nis=${item.siswaId} data-awal=${item.ket}>
								<option value="h" ${(item.ket == 'h')?'selected':null}>Hadir</option>
								<option value="i" ${(item.ket == 'i')?'selected':null}>Izin</option>
								<option value="s" ${(item.ket == 's')?'selected':null}>Sakit</option>
								<option value="a" ${(item.ket == 'a')?'selected':null}>Alpa</option>
								<option value="t" ${(item.ket == 't')?'selected':null}>Telat</option>
							</select>
							</form>
						</td>

					</tr>`
		})

		$(tableId).DataTable().destroy()
		$(tableId+" tbody").html(rows)
		$(tableId).DataTable().draw()
	}

	$(document).on('change', '.ketAbsen', function(){
		var siswa = $(this).data('nama')
		var ketAwal = $(this).data('awal')
		var ket = $(this).val()
		var nis = $(this).data('nis')
		var kodeAbsen= $(this).data('kode')
		var ubah = confirm('Yakin Mengubah Absensi '+siswa+'?')
		if (ubah){
			// alert(ketAwal)
			$.ajax({
				type: 'put',
				url: '/xhr/ubah-absen',
				data: {kodeAbsen: kodeAbsen, nis:nis, ket: ket, ketAwal: ketAwal},
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				complete: function(){
					$('#modalLoader').modal('hide')
				},
				success: function(res) {
					// if (res.status == 'sukses'){
						alert(res.msg)
					// }
				}
			})
		} else {
			$(this).val(ketAwal)
			return false
		}
	})

	// Rekap Wali
	// th No
		// th Tanggal
		// th NIS
		// th Nama
		// th Mapel
		// th Guru
		// th Jamke
		// th ket
	$(document).on('submit', '#formRekapWali', function(e) {
		e.preventDefault()
		var data = $(this).serialize()
		// console.log(data)
		$.ajax({
			type: 'get',
			url: '/xhr/rekap-wali',
			data: data,
			dataType: 'json',
			beforeSend: function(){
				$('#modalLoader').modal()
				// $('#tableRekapWali').html(`
				// 	<thead><tr><th>No</th><th>NIS</th><th>Nama</th></tr></thead><tbody></tbody>

				// 	`)
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			},
			success: function(res){
				if(res.status == 'gagal') {
					$('#bulanRekap').html(getNamaBulan($('#bulan').val())+' '+$('#tahun').val())
					$('#tableRekapWali').html('<b>'+res.msg+'</b>')
				}
				var datas = (res.data)?res.data: null
				var cols = res.cols
				writeTableRekap(datas, '#tableRekapWali', cols)
			}
		})
	})

	async function writeTableRekap(datas, tableId, columns){
		// var cols
		var th
		columns.forEach(item=>{
			// $(tableId +' thead tr').append('<th>'+item+'</th>')
			th += `<th>${item}</th>`
		})
		var thead = `<thead>

				<tr>`+th+`</tr>
				</thead>`


		var rows
		await datas.forEach((item, index) => {
			var kets = item.data
			var cols = ''
			kets.forEach(ket=> {
				cols += `<td class=${(ket.status == 'H')? 'text-center text-success':(ket.status == 'I')?'text-center text-blue': (ket.status == 'S')? 'text-center text-yellow': (ket.status == 'A')? 'text-center text-red': 'text-center text-orange'}>${ket.status}</td>` 
				// '<td>'+ket.status+'</td>'
			})
			rows += `<tr>
						<td>${index+1}</td>
						<td>${item.nama}</td>
						<td>${item.nis}</td>
						${cols}
						<td style="font-weight:600">${item.rekap}</td>
					</tr>`
		})
		var tbody = `
						<tbody>`+rows+`</tbody>
					`
		var bulan = $('#bulan').val()
		var tahun = $('#tahun').val()
		$('#bulanRekap').html('<b>'+getNamaBulan(Number(bulan))+' '+tahun+'</b>')
		var namaWali = $('#namaUser').text()
		var tgl = new Date()
		// $(tableId).DataTable().destroy()
		if(($.fn.dataTable.isDataTable(tableId))) $(tableId).DataTable().destroy()
		$(tableId).html(thead+tbody)
		$(tableId).DataTable({
			scrollY:        "500px",
	        scrollX:        true,
	        scrollCollapse: true,
	        paging:         false,
	        fixedColumns:   {
	            leftColumns: 2,
	            heightMatch: 'auto',
	            rightColumns: 1
	        },
	        dom:'Bfrtip',
	        "lengthMenu": [ 10, "All" ],
	        buttons: [
	            {
	                extend: 'copy',
	                title: $(tableId).attr('data-judul'),
	                messageTop: 'Bulan:  '+getNamaBulan(Number(bulan))+' '+tahun
	            },
	            {
	                extend: 'excel',
	                title: $(tableId).attr('data-judul'),
	                messageTop: 'Bulan:  '+getNamaBulan(Number(bulan))+' '+tahun
	            },
	            {
	                extend: 'print',
	                title: $(tableId).attr('data-judul').toUpperCase(),
	                messageTop: 'Bulan:  '+getNamaBulan(Number(bulan))+' '+tahun,
	                customize: function(win) {
	                	$(win.document.body)
	                		.append('<div class="ttd" style="margin-top: 50px;margin-left: 75%;"><p style="margin:0;">Malang, '+ tgl.getDate()+' '+getNamaBulan(tgl.getMonth()+1) +' '+ tgl.getFullYear() + '</p><p style="margin:0;">Wali Kelas,</p><br><br><br><p style="margin:0; font-weight: 600;text-decoration:underline">'+namaWali+'</p><p style="margin:0; font-weight: 400">NIP/KoPeg.: '+nip+'</p></div>')
	                }
	            },
	            {
	                extend: 'pdf',
	                title: $(tableId).attr('data-judul'),
	                messageTop: 'Bulan:  '+getNamaBulan(Number(bulan[1]))+' '+bulan[0]
	            }
	        ],
		}).draw()
	}

	function getNamaBulan(bulan) {
		var bulans = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
		return bulans[bulan-1]
	}

	// Jurnal guru
	$('#btnAddJurnal').on('click', function(){
		$('#frmIsiJurnalGuru #id').val('')
		$('#frmIsiJurnalGuru #mode').val('create')
		
		$('#modalFormJurnal').modal()
	})
	
	// CKEDITOR.replace('#textJurnal')
	tinymce.init({
	    selector: '#textJurnal',
	    plugins: ['directionality', 'code'],
	    toolbar:['copy cut paste insert code','bold italic underline alignleft aligncenter alignright alignjustify alignnone ltr rtl']
	})

	$('.datetimepicker').datetimepicker({
		format: "yyyy-mm-dd hh:ii",
        autoclose: true,
        todayBtn: true,
        startDate: "2013-02-14 10:00",
        minuteStep: 1
	})
	
	$(document).on('submit', '#frmIsiJurnalGuru', function(e) {
		e.preventDefault()
		var data = $(this).serialize()
		var url = ($(this).children('#mode').val() == 'create') ? '/xhr/tulis-jurnal-guru' : '/xhr/update-jurnal-guru'
		var mode = ($(this).children('#mode').val() == 'create') ? 'post' : 'put'

		
		$.ajax({
			url: url,
			type: mode,
			data: data,
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			},
			success: function(res) {
				if (res.status == 'gagal'){
					alert('gagal')
					console.log(res.msg)
				} else {
					// console.log(res)
					var datas = res.data
					rewriteTableJurnalKu(datas, '#tableJurnalku')
					$('#modalLoader, #modalFormJurnal').modal('hide')

				}

				
			}
		})

		
	})

	$(document).on('click', '.btnHapusJurnal', function(){
		var id = $(this).data('id')
		var nama = $(this).data('nama')
		var hapus = confirm('Yakin menghapus jurnal ' + nama + '?')
		if (!hapus) return false

		$.ajax({
			url: '/xhr/hapus-jurnal',
			type: 'delete',
			data: {id: id},
			dataType: 'json',
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			complete: function(){
				$('#modalLoader').modal('hide')	
			},
			success: function(res){
				if (res.status == 'gagal') alert(res.msg)
				var datas = res.data
				rewriteTableJurnalKu(datas, '#tableJurnalku')
				if ($('.modal.in').length) $('.modal').modal('hide')
				
			}
		})
	})

	$(document).on('click', '.btnEditJurnal', function(){
		var id = $(this).data('id')
		var nama = $(this).data('nama')

		$.ajax({
			url: '/xhr/get-jurnal/'+id,
			type: 'get',
			dataType: 'json',
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			},
			success: function(res) {
				if (res.status == 'gagal') alert(res.msg)

				var jurnal = res.data
				$('#id').val(jurnal.id)
				$('#mode').val('update')
				$('#mulai').val(jurnal.mulai)
				$('#selesai').val(jurnal.selesai)
				$('#lokasi').val(jurnal.lokasi)
				$('#kegiatan').val(jurnal.kegiatan)
				// $('#textJurnal').val(jurnal.uraian)
				tinyMCE.activeEditor.setContent(jurnal.uraian);
				$('#modalFormJurnal').modal()
			}
		})

	})

	$(document).on('click', '.btnDetilJurnal', function () {
		var id = $(this).data('id')
		var nama = $(this).data('nama')

		$.ajax({
			url: '/xhr/get-jurnal/' + id,
			type: 'get',
			dataType: 'json',
			beforeSend: function () {
				$('#modalLoader').modal()
			},
			complete: function () {
				$('#modalLoader').modal('hide')
			},
			success: function (res) {
				if (res.status == 'gagal') alert(res.msg)

				var jurnal = res.data
				$('#modalDetilJurnal .modal-header h4').html('Detil Jurnal '+ jurnal.kegiatan)
				var isi = `
					<div>
						<p>Mulai: ${jurnal.mulai}</p>
						<p>Selesai: ${jurnal.selesai}</p>
						<p>Lokasi Kegiatan: ${jurnal.lokasi}</p>
						<p>Uraian: ${jurnal.uraian}
					</div>
				`
				var footer = `
					<button class="btn btn-warning btnEditJurnal" data-id="${jurnal.id}"><i class="fa fa-pencil"></i> Edit</button>
					<button class="btn btn-danger btnHapusJurnal" data-id="${jurnal.id}"><i class="fa fa-trash"></i> Hapus</button>
					&nbsp; &nbsp;
					<button class="btn btn-primary" data-dismiss="modal"><i class="fa fa-close"></i> Tutup</button>
				`
				$('#modalDetilJurnal .modal-body').html(isi)
				$('#modalDetilJurnal .modal-footer').html(footer)
				$('#modalDetilJurnal').modal()
			}
		})

	})

	// FUngsi Jurnal Guru
	async function rewriteTableJurnalKu(datas, tableId) 
			{
				var rows
				datas.forEach((jurnal, index) => {
					rows += `
							<tr>
								<td>${index+1}</td>
								<td>${jurnal.mulai}</td>
								<td>${jurnal.selesai}</td>
								<td>${jurnal.lokasi}</td>
								<td>${jurnal.kegiatan}</td>
								<td><button class="btn btn-sm btn-info btnDetilJurnal" title="Lihat Detil" data-id="${jurnal.id}" data-nama="${jurnal.kegiatan}"><i class="fa fa-search"></i></button> <button class="btn btn-warning btnEditJurnal" data-id="${jurnal.id}" data-nama="${jurnal.kegiatan}"><i class="fa fa-pencil"></i></button> &nbsp; <button class="btn btn-danger btnHapusJurnal" data-id="${jurnal.id}" data-nama="${jurnal.kegiatan}"><i class="fa fa-trash"></i></button></td>
							</tr>	
							`
					$(tableId).DataTable().destroy()
					$(tableId+' tbody').html(rows)
					$(tableId).DataTable().draw()
				})
			}

	// Profil Guru
	$(document).on('click', '#uploadFoto', function(){
		$('#userFotoInput').trigger('click')
	})
	
	$(document).on('click', '#uploadLatar', function(){
		$('#userLatarInput').trigger('click')
	})

	

	
	$(document).on('change', '#userFotoInput', function(e) {
		
		uploadGambarProfil(e, '#userFotoInput')
	})
	
	$(document).on('change', '#userLatarInput', function(e) {
		
		uploadGambarProfil(e, '#userLatarInput')
	})

	function uploadGambarProfil(e, idFile) {
		var file = e.target.files[0]
		var f = file.name.split('.')
		var type = f[1]
		console.log(type)
		if (type != 'jpg') {
			alert('Upload file gambar.' + type)
			$('#userFotoInput').val('')
			return false
		} else {
			var field = (idFile == '#userFotoInput') ? 'userFoto' : 'fotoLatar'
			var Reader = new FileReader()
			Reader.onload = function (i) {
				
				$('.'+field).css({
					'background-image': 'url(' + i.target.result + ')'
				})
			}

			Reader.readAsDataURL(file)

			
			var url = (idFile == '#userFotoInput') ? '/xhr/profil' : '/xhr/foto-latar'

			var fd = new FormData()
			fd.append('tes', 'Tes Saja')
			fd.append(field, file)
			// console.log(file, fd)

			$.ajax({
				type: 'post',
				url: url,
				data: fd,
				contentType: false,
				processData: false,
				beforeSend: function () {
					// console.log(fd)
				},
				success: function (res) {
					console.log(res)
				}
			})
		}
	}

	$(document).on('dblclick', '.userHP', function() {
		// alert('Edit HP')
		$(this).hide()
		$('#inputHP').show().focus()
		// $('#inputHP input').focus()
	})
	

	$('#inputHP').keyup(function(e) {
		var key = e.which
		var id = $(this).data('id')
		if ( key =='13') {
			var value = $(this).val()
			// alert(id)
			updatePart(id, 'hp', value)
		}
	})

	$(document).on('focusout', '#inputHP', function () {
		$('#inputHP').hide()
		$('.userHP').show()
	})

	$(document).on('dblclick', '.userPwd', function () {
		// alert('Edit HP')
		$(this).hide()
		$('#inputPwd').show().focus()
		// $('#inputHP input').focus()
	})

	$('#inputPwd').keyup(function (e) {
		var key = e.which
		var id = $(this).data('id')
		if (key == '13') {
			var value = $(this).val()
			
			// alert(value)
			updatePart(id, 'password', value, $(this))
		}
	})

	$(document).on('focusout', '#inputPwd', function(){
		$('#inputPwd').hide()
		$('.userPwd').show()
	})

	$(document).on('dblclick', '.userFullname', function () {
		// alert('Edit HP')
		$(this).hide()
		$('#inputFullname').show().focus()
		// $('#inputHP input').focus()
	})

	$('#inputFullname').keyup(function (e) {
		var key = e.which
		var id = $(this).data('id')
		if (key == '13') {
			var value = $(this).val()
			updatePart(id, 'fullname', value, $(this))
		}
	})

	$(document).on('focusout', '#inputFullname', function () {
		$('#inputFullname').hide()
		$('.userFullname').show()
	})

	function updatePart(id, field, value, ini) {
		$.ajax({
			type: 'put',
			url: '/xhr/edit-part-user',
			data: {id: id, field: field, value: value},
			success: function(res) {
				if (res.status == 'gagal') {alert(res.msg); return false }
				// console.log(ini)
				ini.trigger('focusout')
				if(field == 'password') {res.msg = '<a href=/logout>Password sudah diubah. Login ulang untuk memastikan. :)</a>'}
				ini.siblings('span').html(`${res.msg}`)

			}
		})
	}

	// ChartJS
	var url = window.location.href
	// alert(url)
	if (url == window.location.origin +'/dashboard/staf/beranda') {
		// alert(url)
		var ctx = document.getElementById('stafChart').getContext('2d')
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
				datasets: [{
					label: '# of Votes',
					data: [12, 19, 3, 5, 2, 3],
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				}
			}
		})

	}
})