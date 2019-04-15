
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
			data: data,
			dataType:'json',
			success: function(res){
				if(res.status == 'sukses'){
					// $('#dataJadwal').slideDown()
					// $('#doAbsenBox').slideToggle()
					window.location.reload()
				} else {
					console.log(res)
				}
			}
		})
	})

	// edit absen
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
				// console.log(res)
				$('#idAbsen').text(kodeAbsen)
				var datas = res.data
				$('#dataAbsen').slideUp()
				$('#editAbsen').slideDown()
				writeTableAbsenku(datas, '#tableEditAbsen')
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}

		})

		
	})

	// Fungsi edit absen
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
		var url = ($(this).children('#mode').val() == 'create') ? 'tulis-jurnal-guru' : 'update-jurnal-guru'
		var mode = ($(this).children('#mode').val() == 'create') ? 'post' : 'put'

		
		$.ajax({
			url: url,
			type: type,
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
			}
		})
	})

	$(document).on('click', '.btnEditJurnal', function(){
		var id = $(this).data('id')
		var nama = $(this).data('nama')
		alert(id)

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
								<td>`+ jurnal.uraian.substr(0,60) +`[...]</td>
								<td><button class="btn btn-warning btnEditJurnal" data-id="${jurnal.id}" data-nama="${jurnal.kegiatan}"><i class="fa fa-pencil"></i></button> &nbsp; <button class="btn btn-danger btnHapusJurnal" data-id="${jurnal.id}" data-nama="${jurnal.kegiatan}"><i class="fa fa-trash"></i></button></td>
							</tr>	
							`
					$(tableId).DataTable().destroy()
					$(tableId+' tbody').html(rows)
					$(tableId).DataTable().draw()
				})
			}

})