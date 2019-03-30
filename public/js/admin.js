/* no_doc_ready */
// $(window).on('load', function() {
// 		// Animate loader off screen
// 		$(".se-pre-con").fadeOut("slow");;
// 	});

$(document).ready(function(){
	var dataSet;
// $('#modalLoader').modal()
// setTimeout(function(){
// 	$('#modalLoader').modal('hide')
// }, 5000);
// On Modal hide
$('.modal').on('hide.bs.modal', function(){
	// alert('hide modal')
	$(this).children('.form').trigger('reset')
})


// End on modal hide

// Impor
	var dataTable = document.getElementsByClassName('.dataTable')
	$('#btnImport').on('click', function(){
		$('#modalImport').modal()
	})

	var datas =[]
	var rABS = true
	$('#file').on('change', function(e){
		// var datas;
		var files = e.target.files, f = files[0]
		var reader = new FileReader()
		reader.onload = function(e) {
			var data = e.target.result
			if(!rABS) data = new Uint8Array(data)
			var workbook = XLSX.read(data, {type: rABS ? 'binary' : 'array'})
			var sheet1 = workbook.SheetNames[0]
			var rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet1])
			datas = rows
			console.log(rows)
		}
		if(rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
		
	})
	$('#btnImportNow').on('click', function(evt){
		evt.preventDefault()
		var content=$(this).attr('data-content')
		var tableId = '#table'+content.charAt(0).toUpperCase()+ content.slice(1)
		$.ajax({
			type: 'post',
			url: '/xhr/import-'+content,
			data: {datas: datas},
			beforeSend: function(){
				$('#modalLoader').modal()
				$('#modalImport').modal('hide')
			},
			success: function(res) {
				// console.log(res)
				
				if(res.status =='sukses'){
					var isi = res.isi
					var datas = res.data
					var rows;
					if (isi == 'users') {
						writeUsersTable(datas, tableId)
					} else if (isi == 'rombels'){
						writeTableRombels(datas, tableId)
					} else if (isi == 'siswas') {
						writeTableSiswas(datas, tableId)
					} else if (isi == 'mapels') {
						writeTableMapels(datas, tableId)
					} else if (isi == 'jadwals') {
						writeTableJadwals(datas, tableId)
					}
					
					// setTimeout(function(){
					// 	$('.dataTable').DataTable().draw()
					// }, 500);
					// $('.dataTable').DataTable().draw()
				}
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}
		})
	})


	async function writeUsersTable(datas, tableId){
		var rows
		await datas.forEach(function(user, index) {
			rows += '<tr><td>'+(index+1)+'</td><td>'+user.userid+'</td><td>'+user.fullname+'</td><td>'+user.hp+'</td><td>'+user.chatId+'</td><td>'+user.level+'</td><td><button class=\"btn btn-sm btn-warning flat btnEditUser\" data-id='+user.id+' data-nama='+user.fullname+'><i class=\"fa fa-pencil\"></i></button> <button class=\"btn btn-sm btn-danger flat btnDelUser\" data-id='+user.id+' data-nama='+user.fullname+'><i class=\"fa fa-trash\"></i></button></td></tr>'
		})
		await $(tableId).DataTable().destroy()
		await $(tableId+' tbody').html(rows)
		$(tableId).DataTable({
			dom:'Bfrtip',
            "lengthMenu": [ 10, "All" ],
            buttons: [
                {
                    extend: 'copy',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'excel',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'print',
                    title: $(this).data('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'pdf',
                    title: $(this).attr('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                }
            ]
		}).draw()
	}

	async function writeTableRombels(datas, tableId) {
		var rows;
		await datas.forEach((rombel , index) => {
			var wali = (rombel.User == null)?'Belum ada Wali':rombel.User.fullname
			rows += `<tr>
					<td>${index+1}</td>
					<td>${rombel.kodeRombel}</td>
					<td>${rombel.namaRombel}</td>
					<td>${wali}</td>
					<td>
						<button class="btn btn-sm btn-warning flat btnEditRombel" data-id=${rombel.id} data-nama=${rombel.namaRombel}>
							<i class="fa fa-pencil"></i>
						</button>
						<button class="btn btn-sm btn-danger flat btnDelRombel" data-id=${rombel.id} data-nama=${rombel.namaRombel}>
							<i class="fa fa-trash"></i>
						</button>
						<button class="btn btn-sm btn-info flat btnMngRombel" data-id=${rombel.id} data-nama=${rombel.namaRombel}>
							<i class="fa fa-table"></i>
						</button>
					</td>
				</tr>`
		})

		await $(tableId).DataTable().destroy()
		await $(tableId+' tbody').html(rows)
		$(tableId).DataTable({
			dom:'Bfrtip',
            "lengthMenu": [ 10, "All" ],
            buttons: [
                {
                    extend: 'copy',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'excel',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'print',
                    title: $(this).data('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'pdf',
                    title: $(this).attr('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                }
            ]
		}).draw()
		// $(idTbody).html(rows)
	}

	async function writeTableSiswas(datas, tableId){
		var rows
		await datas.forEach((siswa, index) => {
			var rombel = (siswa.Rombel == null) ? 'Belum terdaftar di Kelas' : siswa.Rombel.namaRombel
			rows += `<tr>
					<td>${index+1}</td>
					<td>${siswa.nis}</td>
					<td>${siswa.namaSiswa}</td>
					<td>${siswa.hp}</td>
					<td>${rombel}</td>
					<td>
						<button class="btn btn-sm btn-warning flat btnEditSiswa" data-id=${siswa.id} data-nama=${siswa.namaSiswa}>
							<i class="fa fa-pencil"></i>
						</button>
						<button class="btn btn-sm btn-danger flat btnDelSiswa" data-id=${siswa.id} data-nama=${siswa.namaSiswa}>
							<i class="fa fa-trash"></i>
						</button>
						
					</td>
				</tr>`
		})
		await $(tableId).DataTable().destroy()
		await $(tableId+' tbody').html(rows)
		$(tableId).DataTable({
			dom:'Bfrtip',
            "lengthMenu": [ 10, "All" ],
            buttons: [
                {
                    extend: 'copy',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'excel',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'print',
                    title: $(this).data('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'pdf',
                    title: $(this).attr('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                }
            ]
		}).draw()

	}

// End Impor

// Manajemen User
	$('#btnAddUser').on('click', function() {
		$('#modalFormUser').modal()
	})

	$('#frmAdduser').on('submit', function(e){
		e.preventDefault()
		var user = $(this).serialize()
		var mod = $('#mod').val()
		var tipe = (mod == 'create') ? 'post' : 'put'
		var url = (mod == 'create') ? '/xhr/create-user' : '/xhr/update-user'
		$.ajax({
			url: url,
			type: tipe,
			data: user,
			dataType: 'json',
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			success: function(res){
				if (res.status === 'sukses') {
					$('#frmAdduser').trigger('reset')
					$('#modalFormUser').modal('hide')
					var users = res.data
					var rows
					// alert(res.msg)
					writeUsersTable(users, '#tableUsers')
					// users.forEach(function(user, index) {
					// 	rows += '<tr><td>'+(index+1)+'</td><td>'+user.userid+'</td><td>'+user.fullname+'</td><td>'+user.hp+'</td><td>'+user.chatId+'</td><td>'+user.level+'</td><td><button class=\"btn btn-sm btn-warning flat btnEditUser\" data-id='+user.id+' data-nama='+user.fullname+'><i class=\"fa fa-pencil\" ></i></button> <button class=\"btn btn-sm btn-danger flat btnDelUser\" data-id='+user.id+' data-nama='+user.fullname+'><i class=\"fa fa-trash \" ></i></button></td></tr>'
					// })
					// $('#tableUsers').DataTable().destroy()
					// $('#tbodyUsers').html(rows)
					// $('#tableUsers').DataTable().draw()
				} else {
					alert(res.msg)
					return false
				}
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}
		})
	})
	

	$(document).on('click', '.btnDelUser', function(){
		var id = $(this).attr('data-id')
		var nama = $(this).attr('data-nama')
		var hapus = confirm('Yakin menghapus User: '+nama+'?')
		if (hapus){
			$.ajax({
				type: 'DELETE',
				url: '/xhr/deleteOne',
				data: {id: id, nama: nama},
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				success: function(res) {
					// console.log(res)
					if(res.status =='sukses'){
						var users = res.data
						var rows;
						writeUsersTable(users,'#tableUsers')
						// users.forEach(function(user, index) {
						// 	rows += '<tr><td>'+(index+1)+'</td><td>'+user.userid+'</td><td>'+user.fullname+'</td><td>'+user.hp+'</td><td>'+user.chatId+'</td><td>'+user.level+'</td><td><button class=\"btn btn-sm btn-warning flat btnEditUser\" data-id='+user.id+' data-nama='+user.fullname+'><i class=\"fa fa-pencil\"></i></button> <button class=\"btn btn-sm btn-danger flat btnDelUser\" data-id='+user.id+' data-nama='+user.fullname+'><i class=\"fa fa-trash\"></i></button></td></tr>'
						// })
						// $('#tableUsers').DataTable().destroy()
						// $('#tbodyUsers').html(rows)
						// $('#tableUsers').DataTable().draw()
					}
				},
				complete: function(){
					$('#modalLoader').modal('hide')
				}
			})
		} else {
			return false
		}
	})

	$(document).on('click', '.btnEditUser', function() {
		var id = $(this).attr('data-id')
		$.ajax({
			type: 'get',
			url: '/xhr/getOne/'+id,
			// data: {id: id},
			success: function(res) {
				// console.log(res)
				if(res.status =='sukses'){
					var user = res.data
					$('#id').val(user.id)
					$('#userid').val(user.userid)
					$('#mod').val('update')
					$('#fullname').val(user.fullname)
					$('#password').removeAttr('required')
					$('#hp').val(user.hp)
					$('#level').val(user.level)
					$('#modalFormUser').modal()
				}
			}
		})
		// alert(id)
	})
// End Manajemen User

// Manajemen Rombel / Kelas
	// Add single rombel
	$('#frmAddRombel').on('submit', (e) => {
		e.preventDefault()
		var mod = $('#mod').val()
		var tipe = (mod == 'create') ? 'post' : 'put'
		// var content = $('#content').val()
		var url = (mod == 'create') ? '/xhr/create-rombel' : '/xhr/update-rombel'
		var newRombel = $('#frmAddRombel').serialize()
		// console.log(newRombel)
		var dataSet = []
		$.ajax({
			type: tipe,
			url: url,
			data: newRombel,
			dataType: 'json',
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			success: (res) => {
				if (res.status === 'sukses') {
					$('#frmAddRombel').trigger('reset')
					$('.modal').modal('hide')
					writeTableRombels(res.data, '#tableRombels')
					
					
					
					
					// console.log(dataSet)
				}else {
					alert(res.msg)
					return false
				}
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}
		})
	})


	// Hapus Rombel
	$(document).on('click', '.btnDelRombel', function(){
		var idRombel = $(this).attr('data-id')
		var namaRombel = $(this).attr('data-nama')
		// alert(idRombel, namaRombel)
		var del = confirm('Yakin menghapus Rombel ini?')
		if (del){
			$.ajax({
				type:'delete',
				url: '/xhr/delete-rombel',
				data: {id: idRombel},
				dataType: 'json',
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				success: function(res) {
					var datas = res.data
					if ( res.status == 'sukses'){
						writeTableRombels(datas, '#tableRombels')
					}

				},
				complete: function(){
					$('#modalLoader').modal('hide')
				}
			})
		}
	})
	
	// var studentSelect = $('#mySelect2');
	// $.ajax({
	//     type: 'GET',
	//     url: '/api/students/s/' + studentId
	// }).then(function (data) {
	//     // create the option and append to Select2
	//     var option = new Option(data.full_name, data.id, true, true);
	//     studentSelect.append(option).trigger('change');

	//     // manually trigger the `select2:select` event
	//     studentSelect.trigger({
	//         type: 'select2:select',
	//         params: {
	//             data: data
	//         }
	//     });
	// });

	$('#btnAddRombel').on('click', function() {
		$('#frmAddRombel').trigger('reset')
		$('#modForm').text('Tambah ')
		$('#mod').val('create')
		$('#modalFormRombel').modal()
	})

	$(document).on('click', '.btnEditRombel', function() {
		var id = $(this).attr('data-id')
		$.ajax({
			type: 'get',
			url: '/xhr/get-one-rombel/'+id,
			success: function(res) {
				if (res.status == 'sukses'){
					var waliSelect = $('#selectWali')
					var rombel = res.data
					var op = {
						text: (rombel.User) ? rombel.User.fullname : 'Belum Ada Wali Kelas',
						value: (rombel.User) ? rombel.userId : '0'
					}
					var option = new Option(op.text, op.value, true, true)
					waliSelect.append(option).trigger('change')

					waliSelect.trigger({
						type: 'select2:select',
						params: {
							data: rombel.User
						}
					})
					$('#id').val(id)
					$('#modForm').text('Update ')
					$('#mod').val('update')
					$('#kodeRombel').val(rombel.kodeRombel)
					$('#namaRombel').val(rombel.namaRombel)
					$('#selectWali').val(rombel.userId).trigger('change')
					$('#modalFormRombel').modal()
				}
				

			}
		})
	})
// Autoselect / autofill Wali kelas
	$('#selectWali').select2({
		placeholder: 'Guru / Wali Kelas',
		ajax : {
			url: '/xhr/getSelectUsers',
			dataType: 'json',
			processResults: function(res) {
				return {
					results : res.items
				}
				// data = datas
			
			}
		}
	})

	$(document).on('click', '.btnMngRombel', function() {
		var id = $(this).attr('data-id')
		// alert(id)
		$.ajax({
			type: 'get',
			url: '/xhr/get-data-rombel/'+id,
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			success: function(res) {
				if (res.status == 'sukses') {
					var rombel = res.data
					var members = res.data.Siswas
					$('#idRombel').text(rombel.kodeRombel)
					var rombelSelect = $('#selRombelSrc')
					var op = {
						text: (rombel.namaRombel) ? rombel.namaRombel : 'Belum masuk rombel',
						value: (rombel.kodeRombel) ? rombel.kodeRombel : '0'
					}
					var option = new Option(op.text, op.value, true, true)
					rombelSelect.append(option).trigger('change')

					rombelSelect.trigger({
						type: 'select2:select',
						params: {
							data: rombel.kodeRombel
						}
					})



					
					$('.namaRombel').text(rombel.namaRombel)
					// console.log(members)
					writeMembers(members, '#tblMembers')
					writeNonMembers()
				}
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}
		})

		$('#modalMngRombel').modal()

		
	})
	async function writeNonMembers(){
		$.ajax({
			type: 'get',
			url: '/xhr/non-members',
			dataType: 'json',
			success: function(res){
				var rows
				res.data.forEach((nonMember, index) => {
					rows += `<tr><td class='${nonMember.nis}'><span class='coba'>${nonMember.nis}</span></td><td>${nonMember.namaSiswa}</td><td><input type='checkbox' class='siswa_check' data-nis='${nonMember.nis}'></td></tr>`
				})
				$('#tbodyNonMembers').html(rows)
			}
		})
	}
	async function writeMembers(members, tableId) {
			var rows
			await members.forEach((member, index) => {
				rows += `<tr><td class='${member.nis}'><span class='coba'>${member.nis}</span></td><td>${member.namaSiswa}</td><td><input type='checkbox' class='siswa_check' data-nis='${member.nis}'></td></tr>`
			})
			$(tableId+' tbody').html(rows)
		}



	$(document).on('click', '#selectAllMembers',function(e) {
        if($(this).is(':checked', true)) {
            $('#tbodyMembers .siswa_check').prop('checked', true);
        } else {
            $('#tbodyMembers .siswa_check').prop('checked', false);
        }
        $("#memberDipilih").html(" "+$("#tbodyMembers input.siswa_check:checked").length+" orang.");

       
    });


    $(document).on('click', '#selectAllNonMembers',function(e) {
        if($(this).is(':checked', true)) {
            $('#tbodyNonMembers .siswa_check').prop('checked', true);
        } else {
            $('#tbodyNonMembers .siswa_check').prop('checked', false);
        }
        $("#nonMemberDipilih").html(" "+$("#tbodyNonMembers input.siswa_check:checked").length+" orang.");

       
    });

    $(document).on('click', '#tbodyMembers .siswa_check', function(){
    	$("#memberDipilih").html(" "+$("#tbodyMembers input.siswa_check:checked").length+" orang.");
    })

    $(document).on('click', '#tbodyNonMembers .siswa_check', function(){
    	$("#nonMemberDipilih").html(" "+$("#tbodyNonMembers input.siswa_check:checked").length+" orang.");
    })
    
    $(document).on('click', '#keluarkan', function(){
    	var datas = []
    	var selected = $('#tbodyMembers input:checked')
    	var idRombel = $('#idRombel').text()
    	selected.each(function(){
    		datas.push($(this).attr('data-nis'))
    	})
    	if (selected.length < 1) {
    		alert('Pilih Siswa Dulu')
    		return false
    	} else {
    		$.ajax({
    			type: 'put',
    			url: '/xhr/keluarkan-member',
    			data: {idRombel: idRombel, siswas: datas},
    			dataType: 'json',
    			success: function(res) {
    				if (res.status == 'sukses') {
    					var members = res.data
    					writeMembers(members, '#tblMembers')
    					writeNonMembers()
    				}
    			}
    		})
    	}
    })

    $('#pindahkan').on('click', function() {
    	var srcRombel = $('#idRombel').text()
    	var dstRombel = $('#selRombelDest').val()
    	var datas = []
    	var selected = $('#tbodyMembers input:checked')
    	selected.each(function(){
    		datas.push($(this).attr('data-nis'))
    	})
    	if (selected.length < 1) {
    		alert('Pilih Siswa Dulu')
    		return false
    	} else {
    		$.ajax({
    			type: 'put',
    			url: '/xhr/pindahkan-member',
    			data: {srcRombel: srcRombel, siswas: datas, dstRombel: dstRombel},
    			dataType: 'json',
    			success: function(res) {
    				if (res.status == 'sukses') {
    					var members = res.data
    					writeMembers(members, '#tblMembers')
    					writeNonMembers()
    				}
    			}
    		})
    	}

    	// alert(dstRombel)
    })

    $('#tempatkan').on('click', function(){
    	var idRombel = $('#idRombel').text()
    	var datas = []
    	var selected = $('#tbodyNonMembers input:checked')
    	selected.each(function(){
    		datas.push($(this).attr('data-nis'))
    	})
    	if (selected.length < 1) {
    		alert('Pilih Siswa Dulu')
    		return false
    	} else {
    		$.ajax({
    			type: 'put',
    			url: '/xhr/masukkan-member',
    			data: {idRombel:idRombel, siswas: datas},
    			dataType: 'json',
    			success: function(res) {
    				if (res.status == 'sukses') {
    					var members = res.data
    					writeMembers(members, '#tblMembers')
    					writeNonMembers()
    				}
    			}
    		})
    	}

    })
// End Rombel
// Start Siswa
	$('#selectRombel, .selRombel').select2({
		placeholder: 'Kelas / Rombel',
		ajax : {
			url: '/xhr/get-select-rombels',
			dataType: 'json',
			processResults: function(res) {
				return {
					results : res.items
				}
			}
		}
	})

	$('#frmAddSiswa').on('submit', function(e){
		e.preventDefault()
		var mod = $('#mod').val()
		var tipe = (mod == 'create') ? 'post' : 'put'
		// var content = $('#content').val()
		var url = (mod == 'create') ? '/xhr/create-siswa' : '/xhr/update-siswa'
		var data = $(this).serialize()
		$.ajax({
			type: tipe,
			url: url,
			data: data,
			dataType: 'json',
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			success: function(res){
				if (res.status == 'sukses'){
					var datas = res.data

					writeTableSiswas(datas, '#tableSiswas')
					$('#modalFormSiswa').modal('hide')
				} else {
					alert(res.msg)
					return false
				}
			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}
		})
	})

	$(document).on('click', '.btnDelSiswa', function(){
		var id = $(this).attr('data-id')
		var nama = $(this).attr('data-nama')
		var hapus = confirm('Yakin menghapus siswa: '+ nama + '?')
		if (hapus) {
			$.ajax({
				type: 'delete',
				url: '/xhr/delete-siswa',
				data: {id: id},
				dataType: 'json',
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				success: function(res){
					if (res.status == 'sukses') {
						var datas = res.data
						writeTableSiswas(datas, '#tableSiswas')
					} else {
						alert(res.msg)
						return false
					}
				},
				complete: function(){
					$('#modalLoader').modal('hide')
				}
			})
		} else {
			return false
		}
	})

	$(document).on('click', '.btnEditSiswa', function(){
		var id = $(this).attr('data-id')

		$.ajax({
				type: 'get',
				url: '/xhr/get-one/'+id,
				// data: {id: id},
				dataType: 'json',
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				success: function(res){
					if (res.status == 'sukses') {
						var rombelSelect = $('#selectRombel')
						var siswa = res.data
						var op = {
							text: (siswa.Rombel) ? siswa.Rombel.namaRombel : 'Belum masuk rombel',
							value: (siswa.Rombel) ? siswa.kelasId : '0'
						}
						var option = new Option(op.text, op.value, true, true)
						rombelSelect.append(option).trigger('change')

						rombelSelect.trigger({
							type: 'select2:select',
							params: {
								data: siswa.Rombel
							}
						})
						$('#id').val(id)
						$('#modForm').text('Update ')
						$('#mod').val('update')
						$('#nis').val(siswa.nis)
						$('#hp').val(siswa.hp)
						$('#namaSiswa').val(siswa.namaSiswa)
						$('#selectRombel').val(siswa.kelasId).trigger('change')
						$('#modalFormSiswa').modal()
					}
				},
				complete: function(){
					$('#modalLoader').modal('hide')
				}
			})
	})

// End Siswa

// Start Mapel
	$('#frmAddMapel').on('submit', function(e){
		e.preventDefault()
			var mod = $('#mod').val()
			var tipe = (mod == 'create') ? 'post' : 'put'
			// var content = $('#content').val()
			var url = (mod == 'create') ? '/xhr/create-mapel' : '/xhr/update-mapel'
			var data = $(this).serialize()
			$.ajax({
				type: tipe,
				url: url,
				data: data,
				dataType: 'json',
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				success: function(res){
					if (res.status == 'sukses'){
						var datas = res.data

						writeTableMapels(datas, '#tableMapels')
						$('#modalFormMapel').modal('hide')
					} else {
						alert(res.msg)
						return false
					}
				},
				complete: function(){
					$('#modalLoader').modal('hide')
				}
			})
	})

	// Delete mapel
	$(document).on('click', '.btnDelMapel', function() {
		var idMapel = $(this).data('id')
		var namaMapel = $(this).data('nama')
		var del = confirm('Yakin menghapus mapel: '+namaMapel+'?')
		if (del) {
			$.ajax({
				type: 'delete',
				url: '/xhr/delete-mapel',
				data: {id: idMapel},
				dataType: 'json',
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				success: function(res){
					if (res.status == 'sukses') {
						var datas = res.data
						writeTableMapels(datas, '#tableMapels')
					} else {
						alert(res.msg)
						return false
					}
				},
				complete: function(){
					$('#modalLoader').modal('hide')
				}

			})
		}
	})

	$(document).on('click', '.btnEditMapel', function() {
		var idMapel = $(this).data('id')
		$.ajax({
			type: 'get',
			url: '/xhr/data-mapel/'+idMapel,
			beforeSend: function(){
				$('#modalLoader').modal()
			},
			success: function(res) {
				if (res.status == 'sukses') {
					var mapel = res.data
					$('#id').val(mapel.id)
					$('#mod').val('update')
					$('#modForm').text('Edit')
					$('#kodeMapel').val(mapel.kodeMapel)
					$('#namaMapel').val(mapel.namaMapel)
					$('#modalFormMapel').modal()
				}
				

			},
			complete: function(){
				$('#modalLoader').modal('hide')
			}
		})
	})

	// Fungsi Mapel
	async function writeTableMapels(datas, tableId) {
			var rows
		await datas.forEach((mapel, index) => {
			// var rombel = (siswa.Rombel == null) ? 'Belum terdaftar di Kelas' : siswa.Rombel.namaRombel
			rows += `<tr>
					<td>${index+1}</td>
					<td>${mapel.kodeMapel}</td>
					<td>${mapel.namaMapel}</td>
					<td>
						<button class="btn btn-sm btn-warning flat btnEditMapel" data-id=${mapel.id} data-nama=${mapel.namaMapel}>
							<i class="fa fa-pencil"></i>
						</button>
						<button class="btn btn-sm btn-danger flat btnDelMapel" data-id=${mapel.id} data-nama=${mapel.namaMapel}>
							<i class="fa fa-trash"></i>
						</button>
						
					</td>
				</tr>`
		})
		await $(tableId).DataTable().destroy()
		await $(tableId+' tbody').html(rows)
		$(tableId).DataTable({
			dom:'Bfrtip',
            "lengthMenu": [ 10, "All" ],
            buttons: [
                {
                    extend: 'copy',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'excel',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'print',
                    title: $(this).data('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'pdf',
                    title: $(this).attr('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                }
            ]
		}).draw()
		}
// End Mapel

// Start Jadwal
	var hari = [
				{id: 'Senin', text: 'Senin'},
				{id: 'Selasa', text: 'Selasa'},
				{id: 'Rabu', text: 'Rabu'},
				{id: 'Kamis', text: 'Kamis'},
				{id: 'Jumat', text: 'Jumat'},
			]
	$('#selectHari').select2({
		data: hari
	})

// Select Mapel
	$('#selectMapel').select2({
		placeholder: 'Mapel',
		ajax : {
			url: '/xhr/get-select-mapels',
			dataType: 'json',
			processResults: function(res) {
				return {
					results : res.items
				}
				// data = datas
			
			}
		}
	})
// Select Jam Ke
	var jamke = [
				{id: '1', text: '1'},
				{id: '2', text: '2'},
				{id: '3', text: '3'},
				{id: '4', text: '4'},
				{id: '5', text: '5'},
				{id: '6', text: '6'},
				{id: '7', text: '7'},
				{id: '8', text: '8'},
				{id: '9', text: '9'},
				{id: '10', text: '10'},
			]
	$('.selectJamke').select2({
		data: jamke
	})

	// Form Jadwal
	$('#frmJadwal').on('submit', function(e){
		e.preventDefault()
			var mod = $('#mod').val()
			var tipe = (mod == 'create') ? 'post' : 'put'
			// var content = $('#content').val()
			var url = (mod == 'create') ? '/xhr/create-jadwal' : '/xhr/update-jadwal'
			var data = $(this).serialize()
			$.ajax({
				type: tipe,
				url: url,
				data: data,
				dataType: 'json',
				beforeSend: function(){
					$('#modalLoader').modal()
				},
				success: function(res){
					if (res.status == 'sukses'){
						var datas = res.data

						writeTableJadwals(datas, '#tableJadwals')
						$('#modalFormJadwal').modal('hide')
					} else {
						alert(res.msg)
						return false
					}
				},
				complete: function(){
					$('#modalLoader').modal('hide')
				}
			})
	})


	// Function Jadwal
	async function writeTableJadwals(datas, tableId) {
			var rows
		await datas.forEach((jadwal, index) => {
			// var rombel = (siswa.Rombel == null) ? 'Belum terdaftar di Kelas' : siswa.Rombel.namaRombel
			rows += `<tr>
					<td>${index+1}</td>
					<td>${jadwal.hari}</td>
					<td>${jadwal.User.fullname}</td>
					<td>${jadwal.Mapel.namaMapel}</td>
					<td>${jadwal.Rombel.namaRombel}</td>
					<td>${jadwal.jamke}</td>
					<td>
						<button class="btn btn-sm btn-warning flat btnEditMapel" data-id=${jadwal.id} data-nama=${jadwal.kodeJadwal}>
							<i class="fa fa-pencil"></i>
						</button>
						<button class="btn btn-sm btn-danger flat btnDelMapel" data-id=${jadwal.id} data-nama=${jadwal.kodeJadwal}>
							<i class="fa fa-trash"></i>
						</button>
						
					</td>
				</tr>`
		})
		await $(tableId).DataTable().destroy()
		await $(tableId+' tbody').html(rows)
		$(tableId).DataTable({
			dom:'Bfrtip',
            "lengthMenu": [ 10, "All" ],
            buttons: [
                {
                    extend: 'copy',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'excel',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'print',
                    title: $(this).data('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'pdf',
                    title: $(this).attr('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                }
            ]
		}).draw()
	}
// End Jadwal

	var dataTable = $('.dataTable').DataTable({
		dom:'Bfrtip',
            "lengthMenu": [ 10, "All" ],
            buttons: [
                {
                    extend: 'copy',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'excel',
                    title: $('.dataTable').attr('data-judul'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'print',
                    title: $(this).data('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                },
                {
                    extend: 'pdf',
                    title: $(this).attr('data-title'),
                    messageTop: 'Tanggal:  '+ new Date()
                }
            ]
	})
	// dataTable.ajax.reload()

})