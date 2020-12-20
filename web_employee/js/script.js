var baseUrl = 'https://api.acquire.jobs/';
var utcOffest = new Date().getTimezoneOffset();
var coordinates = {};
var headers = 	{ 
    'content-language':'en', 
    'utcoffset': utcOffest
};
var filetype = '';
var fileUploaded = '';



	/*********************************************
	*
	*			Search result function starts
	*
	**********************************************/
	function removeParam(key, sourceURL) {
		var rtn = sourceURL.split("?")[0],
			param,
			params_arr = [],
			queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
		if (queryString !== "") {
			params_arr = queryString.split("&");
			for (var i = params_arr.length - 1; i >= 0; i -= 1) {
				param = params_arr[i].split("=")[0];
				if (param === key) {
					params_arr.splice(i, 1);
				}
			}
			rtn = rtn + "?" + params_arr.join("&");
		}
		return rtn;
	}

	function getResult(query,token, currentpage){
		$.ajax({
	        type : 'get',
	        headers : { 
			    'content-language' : 'en',
			  //  'authorization' : 'Bearer '+token,
			    'Content-Type' : 'application/json',
			},
			data : query,
	        url : baseUrl + 'job/jobListing',
	        success : function(resp){
	        	//console.log(resp.data.jobs)
	        	if(resp.data.count > 0){
					
					var options = '';
	        		$('#search-list').children().remove()
		        	resp.data.jobs.forEach(item => {
		        		var avail = '';
		        		if(![null,undefined,''].includes(item.availability) && item.availability.length > 0){
		        			
		        			for(var i = 0; i < item.availability.length; i++){
		        				if(item.availability[i] == 'AVAILABLE_FULL_TIME')
		        					avail+='Full Time, ';
		        				if(item.availability[i] == 'AVAILABLE_PART_TIME')
		        					avail+='Part Time, ';
		        				if(item.availability[i] == 'AVAILABLE_CASUALY')
		        					avail+='Casual';

		        			}
							var desc = item.description.substring(0,20)
		        			options+=`<div class="searchblks" data-id="${item._id}">
												<a href="./jobpost.html?id=${item._id}">
													<div class="row">
														<div class="col-sm-2 col-3 sesrchblkletf">
															<img src="${item.employer.profilePic}">
														</div>
														<div class="col-sm-10 col-9 searchblkright">
															<span>${item.employer.name}</span>
															<h3>${item.jobName}</h3>
															<ul>
																<li><i class="simple-icon-clock"></i>${avail}</li>
																<li>$ ${item.startRange} - ${item.endRange}</li>
																<li><i class="simple-icon-location-pin"></i>${item.address.text}</li>
															</ul>
														</div>
													</div>
												</a>
											</div>`;
		        		}
		                
		            });
					$('#search-list').html(options)
					if(resp.data.count > 25){
						var pagination = ``;
						if(['',null,undefined].includes(currentpage))
							currentpage = 1;
						// var url_string = window.location.href;
						// var url = new URL(url_string);
						// var page = ['',null,undefined].includes(url.searchParams.get("page")) ? 1 : url.searchParams.get("page");
						// var rtn = removeParam("page", url_string);
						//console.log(rtn)
						var pages = Math.ceil(resp.data.count/25);
						for(var p = 1;p <= pages; p++){
							pagination+=`<li class="pages-link `+(p == currentpage ? 'active' : '')+`" data-page="${p}"><a href="javascript:void(0)" data-page="${p}" class="">${p}</a></li>`;
						}
						//console.log(url_string);
						$('#pagination').html(pagination)
					}
					
		    	}else{
					$('#search-list').html('<p class="text-center">No result found</p>')
					$('#pagination').html('')
					
		    	}
	            
				$('#loader').hide();
	        },
	        fail: function(resp){
				toastr.error('request failed');
	            //toastr.error('request failed');
	        },
	        error: function(resp){
				toastr.error(resp.responseJSON.message);
	            //alert(resp.responseJSON.message)
	        }
	    });
	}
	/*********************************************
	*
	*			Search result function starts
	*
	**********************************************/
$(document).ready(function(){
	var url_string = window.location.href;
	var url = new URL(url_string);
	var limit = 25;
	var skip = 0;
	function getData(type){
		switch(type) {
		  case 'token':
		    return localStorage.getItem("_obtoken")
		    break;
		  case 'userData':
		    	return JSON.parse( localStorage.getItem("_obuser") )
		    break;
		}
	}
	$(document).on('click','#logout',function(){
		localStorage.removeItem("_obuser")
		localStorage.removeItem("_obtoken")
		window.location.replace('./');
	})
	/*********************************************
	*
	*			include header starts
	*
	**********************************************/
	var userData = getData('userData');

	if(!['',undefined,null].includes(userData)){
		var headerButtons = `<ul class="navbar-nav">
								<li class="nav-item">
								<a class="nav-link" href="javascript:void(0)" id="logout">Logout</a>
								</li>
								<li class="nav-item">
								<a class="nav-link signup" href="./profile_step4.html">Hey ${userData.name}</a>
								</li>
							</ul>`;
	}else{
		var headerButtons = `<ul class="navbar-nav">
								<li class="nav-item">`;
							if(typeof(is_signin) != "undefined" && is_signin !== null){
								headerButtons+=`<a class="nav-link signup" href="./signin.html">Sign In</a>`;
							}else{
								headerButtons+=`<a class="nav-link" href="./signin.html">Sign In</a>`;
							}	
							headerButtons+=`</li>
							<li class="nav-item">`;
							if(typeof(is_signup) != "undefined" && is_signup !== null){
								headerButtons+=`<a class="nav-link signup" href="./profile_signup.html">Sign Up</a>`
							}else{
								headerButtons+=`<a class="nav-link" href="./profile_signup.html">Sign Up</a>`
							}
							headerButtons+=`</li>
							</ul>`;
	}
	$('#navbarNav').append(headerButtons);

	var headerSearch = `<div id="loader"></div>
						<form class="searchform" action="./search.html">
							<div class="row">
								<div class="col">
									<div class="custom-select customsel_box">
										<label class="form-group  mb-4">
											<span>Job Title</span>								
											<input id="search-title" class="form-control" type="text" placeholder="Job Title" name="title">
										</label>
									</div>
								</div>
								<div class="col">
									<div class="custom-select customsel_box categorybox">
									<label class="form-group  mb-4">
											<span>Category</span>								
												<!--<select>
											<option value="0">Any:</option>
											<option value="1">Category1</option>
											<option value="2">Category2</option>
											<option value="3">Category3</option>
											<option value="4">Category4</option>
											<option value="5">Category5</option>
										</select>-->
										
										<div class="select-data data-name">
										<select name="industryId[]" class="selectpicker" title="Any" id="category-select-box" multiple data-live-search="true">
										</select>
									</div>
										</label>                        
									</div>
								</div>
								<div class="col">
									<div class="custom-select customsel_box">
											<label class="form-group  mb-4">
											<span>Job Location</span>								
											<input name="sl" class="form-control" type="text" placeholder="Melbourne" id="search-location" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
											<div class="dropdown-menu cstm-dropdown" id="location-dropdown" style="display:none">
											</div>
											<input name="lat" id="lat" type="hidden">
											<input name="lng" id="lng" type="hidden">
											
										</label>
								</div>
								</div>
								<div class="col searchbtn">
									<button type="submit" class="btn btn-primary"><i class="simple-icon-magnifier"></i></button>
								</div>
							</div>
						</form>`;

	$('#header-search').append(headerSearch);

	/*********************************************
	*
	*			include header ends
	*
	**********************************************/


	

	/*********************************************
	*
	*			Employee signup script starts
	*
	**********************************************/
	if(typeof(is_signup) != "undefined" && is_signup !== null){
		
		$("#employee-signup").validate({
			rules:{
	      		password: {
	                passwordCheck: true
	            }
	        },
	        messages: {
				password: 'Password must contain at least one capital letter, small letter, digit with minimum 8 character'
			},
	        tooltip_options: {
	           	password: { 
	           		placement: 'right' 
	           	},
	           	email: { 
	           		placement: 'right' 
	           	},
	           	name: { 
	           		placement: 'right' 
	           	},
	        },

			submitHandler: function(form) {
				var formData = $(form).serialize() +
					'&deviceType=WEB';
				$.ajax({
					type : 'POST',
					url : baseUrl+'employee/registerEmail',
					data: formData,
		            cache: false,             
		            processData: false, 
		           	headers: headers,
					success : function(resp){
						if(resp.statusCode == 200){
							console.log('hi');
							localStorage.setItem("_obtoken", resp.data.token);
							localStorage.setItem("_obuser", JSON.stringify(resp.data.user) );
							window.location.replace('./profile_step1.html')
						}else{
							toastr.error(resp.message);
							//alert(resp.message)
						}
						return false;
					},
					error:function (resp){
						toastr.error(resp.responseJSON.message);
						//alert(resp.responseJSON.message)
				    }
				})
				return false;
			}
		});

		$.validator.addMethod("passwordCheck", function(value) {
		   return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
		       && /[a-z]/.test(value) // has a lowercase letter
		       && /\d/.test(value) // has a digit
		});
	}

	/*********************************************
	*
	*			Employee signup script ends
	*
	**********************************************/


	/*********************************************
	*
	*			Employee job search starts
	*
	**********************************************/
	$(document).on('keyup','#search-location',function(){
		var keyword = $(this).val();
		$('#location-dropdown').slideUp();
		if(keyword.length > 2){
		    $.ajax({
		        type : 'get',
		        url : baseUrl + `job/getPlaces?keyword=${keyword}`,
		        success : function(resp){
		            var options = '';
		            if(!['',null,undefined].includes(resp.data.predictions) && resp.data.predictions.length > 0){
			            resp.data.predictions.forEach(item => {
			                options+=`<a class="dropdown-item location-item" href="javascript:void(0)" lat='${item.geometry.location.lat}' lng='${item.geometry.location.lng}'>${item.formatted_address}</a>`;
			            })
			            $('#location-dropdown').html(options);
			            $('#location-dropdown').slideDown();
			        }else{
			            $('#location-dropdown').html(`<a class="dropdown-item" href="javascript:void(0)" >No result found</a>`);
			            $('#location-dropdown').slideDown();
			        }
		        },
		        fail: function(resp){
					toastr.error('request failed');
					
		         }
		    })
		}
	})
	$(document).on('click','.location-item',function(){
	    var text = $(this).text()
	    $('#search-location').val(text);
	    $('#lat').val($(this).attr('lat'))
	    $('#lng').val($(this).attr('lng'))
	    $('#location-dropdown').slideUp();
	})

	
	$.ajax({
		type : 'get',
		url : baseUrl + 'job/getAllIndustry',
		success : function(resp){
			var industryId = [];
			industryId = url.searchParams.getAll("industryId[]");
			var options = '';
			resp.data.industryData.forEach(item => {
				options+=`<option value="${item._id}" `+(industryId.includes(item._id) ? 'selected':'')+`>${item.description}</option>`;
			})
			$(document).find('#category-select-box').append(options);
			$(document).find('#category-select-box').selectpicker('refresh');
		},
		fail: function(resp){
			toastr.error('request failed');
			}
	})
	

	/*********************************************
	*
	*			Employee job search ends
	*
	**********************************************/

	/*********************************************
	*
	*			Employee profile step 1 starts
	*
	**********************************************/
	if(typeof(is_step_1) != "undefined" && is_step_1 !== null){
		filetype = 'profilePicture';
		var UserData = getData('userData');
		$('#user-name').text(UserData.name)

	    $("#profile_step_1").validate({
	        tooltip_options: {
	           	aboutMe: { 
	           		placement: 'right' 
	           	},
	        },

			submitHandler: function(form) {
				var availability = [];
				if( ['',null,undefined].includes(fileUploaded) ){
					toastr.error('Profile picture is required.')
					return false;
				}
				if( ['',null,undefined].includes( $('#category_id').val() ) ){
					toastr.error('Please select category from list.')
					return false;
				}
				$('#availability').find('li.ui-selected').each( function(e){
					availability.push($(this).find('a').attr('data-value'))
				})
				if( availability.length <= 0 ){
					toastr.error('Availability is required.')
					return false;
				}
				UserData.aboutMe = $("#aboutMe").val();
				UserData.category = $("#category_id").val();
				UserData.availability = availability;
				UserData.profilePic = fileUploaded;
				localStorage.setItem("_obuser", JSON.stringify(UserData) );
				window.location.replace('./profile_step2.html');
				
			}
		});

		$('#search-work').on('keyup',function(){
			var keyword = $(this).val();
			if(keyword.length > 1){
			    $.ajax({
			        type : 'get',
			        url : baseUrl + `job/getAllCategory?categoryName=CATEGORY&description=`+keyword,
			        success : function(resp){
			            var options = '';
			            if(!['',null,undefined].includes(resp.data.categoryData) && resp.data.categoryData.length > 0){
				            resp.data.categoryData.forEach(item => {
				                options+=`<a class="dropdown-item work-item" href="javascript:void(0)" data-id='${item._id}'>${item.description}</a>`;
				            })
				            $('#work-as').html(options);
				            $('#work-as').slideDown();
				        }else{
				            $('#work-as').html(`<a class="dropdown-item" href="javascript:void(0)" >No result found</a>`);
				            $('#work-as').slideDown();
				        }
			        },
			        fail: function(resp){
			            toastr.error('request failed');
			         }
			    })
			}
		})
		$(document).on('click','.work-item',function(){
		    var text = $(this).text()
		    $('#search-work').val(text);
		    $('#work-as').slideUp();
		    $('#category_id').val($(this).attr('data-id'))
		})
	}



	/*********************************************
	*
	*			Employee profile step 1 ends
	*
	**********************************************/



	/*********************************************
	*
	*			Employee profile step 2 starts
	*
	**********************************************/

	if(typeof(is_step_2) != "undefined" && is_step_2 !== null){
		var UserData = getData('userData');
		$('#user-name').text(UserData.name)

		$.ajax({
	        type : 'get',
	        url : baseUrl + 'job/getAllCategory?categoryName=SKILL&parentId='+UserData.category,
	        success : function(resp){
	            var options = '';
	            resp.data.categoryData.forEach(item => {
	                options+=`<li class="skills-list"><a href="javascript:void(0)" data-id='${item._id}'>${item.description}</a></li>`;
	            })
	            $('#skills').append(options);
	            new Selectable({
			         filter : list1.children,
			         appendTo : list1,
			         toggle : true
		        });
	        },
	        fail: function(resp){
	            toastr.error('request failed');
	         }
		})
		
		$.ajax({
	        type : 'get',
	        url : baseUrl + 'job/getAllCategory?categoryName=TASK&parentId='+UserData.category,
	        success : function(resp){
	            var options = '';
	            resp.data.categoryData.forEach(item => {
	                options+=`<li class="skills-list"><a href="javascript:void(0)" data-id='${item._id}'>${item.description}</a></li>`;
	            })
	            $('#tasks').append(options);
	            new Selectable({
			         filter : list2.children,
			         appendTo : list2,
			         toggle : true
		        });
	        },
	        fail: function(resp){
	            toastr.error('request failed');
	         }
		})

		$.ajax({
	        type : 'get',
	        url : baseUrl + 'job/getAllCategory?categoryName=ABILITY&parentId='+UserData.category,
	        success : function(resp){
	            var options = '';
	            resp.data.categoryData.forEach(item => {
	                options+=`<li class="skills-list"><a href="javascript:void(0)" data-id='${item._id}'>${item.description}</a></li>`;
	            })
	            $('#abilities').append(options);
	            new Selectable({
			         filter : list3.children,
			         appendTo : list3,
			         toggle : true
		        });
	        },
	        fail: function(resp){
	            toastr.error('request failed');
	         }
		})
		
	    $('#continue-step2').on('click',function(){
			var skills = [];
			var tasks = [];
			var abilities = [];
	    	$('#skills').find('li.ui-selected').each( function(e){
	    		if( $(this).find('a').text().trim() != 'Add a skill' )
					skills.push($(this).find('a').attr('data-id'))
			})
			if( skills.length <= 0 ){
				toastr.error('Skill is required.')
				return false;
			}
			$('#tasks').find('li.ui-selected').each( function(e){
					tasks.push($(this).find('a').attr('data-id'))
			})
			if( tasks.length <= 0 ){
				toastr.error('Task is required.')
				return false;
			}

			$('#abilities').find('li.ui-selected').each( function(e){
					abilities.push($(this).find('a').attr('data-id'))
			})
			if( abilities.length <= 0 ){
				toastr.error('Ability is required.')
				return false;
			}

			UserData.skills = skills;
			UserData.tasks = tasks;
			UserData.abilities = abilities;
			localStorage.setItem("_obuser", JSON.stringify(UserData) );

			window.location.replace('./profile_step3.html');
	    })
	}


	/*********************************************
	*
	*			Employee profile step 2 ends
	*
	**********************************************/


	/*********************************************
	*
	*			Employee profile step 3 starts
	*
	**********************************************/

	if(typeof(is_step_3) != "undefined" && is_step_3 !== null){
		filetype = 'employeeDocs';
		var UserData = getData('userData');
		$('#user-name').text(UserData.name)


		$('#step-3').on('click',function(){

			var formData = JSON.parse( localStorage.getItem("profileData") );
			var setData = {};

			if(!['',null,undefined].includes(fileUploaded)){
				UserData.resumes = [{'links':[fileUploaded],'name':'resume'}];
				setData.resumes = UserData.resumes;
			}
			
			setData.aboutMe = UserData.aboutMe;
			setData.category = UserData.category;
			setData.availability = UserData.availability;
			setData.profilePic = UserData.profilePic;
			
			setData.skills = UserData.skills;

			localStorage.setItem("_obuser", JSON.stringify(UserData) );
			let token = getData('token');
			$.ajax({
		        type : 'put',
		        data : JSON.stringify(setData),
		        headers : { 
				    'content-language' : 'en',
				    'authorization' : 'Bearer '+token,
				    'Content-Type' : 'application/json',
				},
		        url : baseUrl + 'employee/editProfile',
		        success : function(resp){
					//console.log(resp)
		        	window.location.replace('./search.html?industryId[]='+UserData.category)

		        },
		        fail: function(resp){
		            toastr.error('request failed');
		        },
		        error: function(resp){
		            toastr.error(resp.responseJSON.message);
		        }
		    })
		});

	}


	/*********************************************
	*
	*			Employee profile step 3 ends
	*
	**********************************************/

	/*********************************************
	*
	*			Employee profile signin starts
	*
	**********************************************/
	if(typeof(is_signin) != "undefined" && is_signin !== null){

		$("#login-form").validate({
			rules:{
	      		password: {
	                passwordCheck: true
	            }
	        },
	        messages: {
				password: 'Password must contain at least one capital letter, small letter, digit with minimum 8 character'
			},
	        tooltip_options: {
	           	password: { 
	           		placement: 'right' 
	           	},
	           	email: { 
	           		placement: 'right' 
	           	},
	        },

			submitHandler: function(form) {
				var formData = $(form).serialize() + '&deviceType=WEB';
				$.ajax({
					type : 'POST',
					url : baseUrl+'user/login',
					data: formData,
		            cache: false,             
		            processData: false, 
		           	headers: headers,
					success : function(resp){
						if(resp.statusCode == 200){
							localStorage.setItem("_obtoken", resp.data.token);
							localStorage.setItem("_obuser", JSON.stringify(resp.data.user) );
							window.location.replace('./search.html?')
						}else{
							toastr.error(resp.message)
						}
						return false;
					},
					error:function (resp){
						toastr.error(resp.responseJSON.message);
				    }
				})
				return false;
			}
		});

		$.validator.addMethod("passwordCheck", function(value) {
		   return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
		       && /[a-z]/.test(value) // has a lowercase letter
		       && /\d/.test(value) // has a digit
		});

	}


	/*********************************************
	*
	*			Employee profile signin  ends
	*
	**********************************************/


	/*********************************************
	*
	*			Employee profile step 4 starts
	*
	**********************************************/

	if(typeof(is_step_4) != "undefined" && is_step_4 !== null){
		if( ['',null,undefined].includes(window.localStorage.getItem('_lastJob') ) ){
			var lastJob = `<div class="col profile_contblk">
									<span>No last viewed job</span>
								</div>`;
		}else{
			var lastJobDetails = JSON.parse( window.localStorage.getItem('_lastJob') )
			var lastJob = `<div class="col profile_imgblk">
									<img src="${lastJobDetails.data.employer.profilePic}" >
								</div>
								<div class="col profile_contblk">
									<h3>${lastJobDetails.data.jobName}</h3>
									<span>${lastJobDetails.data.description}</span>
									
								</div>`;
		}
		$('#last-job').html(lastJob);
		var UserData = getData('userData');
		let token = getData('token');
		headers.authorization = 'Bearer '+token;

		$.ajax({
			type : 'get',
			url : baseUrl+'user/accessTokenLogin',
			headers: headers,
			success : function(resp){
				console.log("resp",resp)
				if(resp.statusCode == 200){
					$('#user-name').text(resp.data.user.name)
				//	$('#job-name').text(resp.data.employer.name)
					// $('#profile-pic').attr('src',resp.data.user.profilePic)
					var profilePicUrl = '';
					if(resp.data.user.profilePic){
						profilePicUrl = `<img src="${resp.data.user.profilePic}">`
						$('#profile-pic').append(profilePicUrl);
					} else{
						profilePicUrl = `<img src="img/profile-image.png">`
						$('#profile-pic').append(profilePicUrl);
					}
					$('#aboutMe').text(resp.data.user.employee.aboutMe)
					$('#employee-name').text(resp.data.user.name)
					$('#category-name').text(resp.data.user.employee.category ? resp.data.user.employee.category.description : '')
					var abilities = ``;
					var availabilities = '';
					var skills = '';
					var tasks = '';
					var resumeUrl = '';

					if(resp.data.user.employee.resumes.length > 0){
						resumeUrl = `<img src="${resp.data.user.employee.resumes[0].links[0]}">`
						$('#resume-url').append(resumeUrl);
					} else{
						resumeUrl = `<img src="img/Original_Functional.png">`
						$('#resume-url').append(resumeUrl);
					}
					if(resp.data.user.employee.abilities.length > 0){
						resp.data.user.employee.abilities.forEach(item => {
							abilities+=`<li class="active"><a href="javascript:void(0)" data-id='${item._id}'>${item.description}</a></li>`;
						})
						$('#abilities').append(abilities);
					}
					if(resp.data.user.employee.availability.length > 0){
						resp.data.user.employee.availability.forEach(item => {
							let availabilityStatus = '';
							if(item == 'AVAILABLE_FULL_TIME'){
								availabilityStatus = 'FULL TIME'
							}
							if(item == 'AVAILABLE_PART_TIME'){
								availabilityStatus = 'PART TIME'
							}
							if(item == 'AVAILABLE_CASUALY'){
								availabilityStatus = 'CASUAL'
							}
							availabilities+=`<li class="active"><a href="javascript:void(0)">${availabilityStatus}</a></li>`;
						})
						$('#availabilities').append(availabilities);
					}
					if(resp.data.user.employee.skills.length > 0){
						resp.data.user.employee.skills.forEach(item => {
							skills+=`<li class="active"><a href="javascript:void(0)" data-id='${item._id}'>${item.description}</a></li>`;
						})
						$('#skills').append(skills);
					}

					if(resp.data.user.employee.tasks.length > 0){
						resp.data.user.employee.tasks.forEach(item => {
							tasks+=`<li class="active"><a href="javascript:void(0)" data-id='${item._id}'>${item.description}</a></li>`;
						})
						$('#tasks').append(tasks);
					}
				}else{
					toastr.error(resp.message)
				}
				return false;
			},
			error:function (resp){
				toastr.error(resp.responseJSON.message);
			}
		})
		

	}

	/*********************************************
	*
	*			Employee profile step 4 ends
	*
	**********************************************/



	/*********************************************
	*
	*			job listing starts
	*
	**********************************************/

	if(typeof(is_joblisting) != "undefined" && is_joblisting !== null){

		$('#loader').show();
		var UserData = getData('userData');
		if(!['',null,undefined].includes(UserData))
			$('#user-name').text(UserData.name)
		
		var title = url.searchParams.get("title");
		var title = url.searchParams.get("title");
		var locationName = url.searchParams.get("sl");

		var industryId = url.searchParams.getAll("industryId[]");
		//console.log(industryId);
		$('#search-title').val(title)
		$('#search-location').val(locationName);

		
		var lat = url.searchParams.get("lat");
		var lng = url.searchParams.get("lng");

		$('#lat').val(lat);
		$('#lng').val(lng);


		if(!['',null,undefined].includes(lat) && !['',null,undefined].includes(lng))
			var latlng = [lat,lng];
		//console.log(latlng)
		localStorage.setItem("_obuser", JSON.stringify(UserData) );
		
		let token = getData('token');

		var query = {};
		if(!['',null,undefined].includes(title))
			query.jobTitle = title;
		if(!['',null,undefined].includes(industryId) && industryId.length > 0)
			query.industryIds = JSON.stringify(industryId);
		if(!['',null,undefined].includes(latlng) && latlng.length > 0)
			query.location = JSON.stringify(latlng);
		
		query.jobType = 'AVAILABLE';	
		query.limit = limit;

		var page = url.searchParams.get("page");
		if(page == 1 || ['',null,undefined].includes(page))
			query.skip = skip;
		else
			query.skip = ( (page-1)*25)
		getResult(query, token);

		var experienceLevel = [];
		var availability = [];
	    $('.ob_filter').on('click',function(){
			$('#loader').show();
	    	experienceLevel = [];
			availability = [];

	    	query.startRange = $("#dashboardPriceRange")[0].noUiSlider.get()[0].substring(1)
	    	query.endRange = $("#dashboardPriceRange")[0].noUiSlider.get()[1].substring(1)
	    
	    	$('#Experience').find('li.ui-selected').each( function(e){
					experienceLevel.push($(this).attr('data-value'))
			});
			$('#Job').find('li.ui-selected').each( function(e){
					availability.push($(this).attr('data-value'))
			});
			if(!['',null,undefined].includes(experienceLevel) && experienceLevel.length > 0)
				query.experienceLevel = JSON.stringify(experienceLevel);
			
			if(!['',null,undefined].includes(availability) && availability.length > 0 )
				query.availability = JSON.stringify(availability);

			getResult(query, token);
	    })

	    $("#dashboardPriceRange")[0].noUiSlider.on('change', function () { 
	    	$('#loader').show();
	    	query.startRange = $("#dashboardPriceRange")[0].noUiSlider.get()[0].substring(1)
	    	//console.log(query.startRange)
	    	query.endRange = $("#dashboardPriceRange")[0].noUiSlider.get()[1].substring(1)
	    	
	    	getResult(query, token);

		});
		
		$(document).on('click',".pages-link", function () { 
			$('#loader').show();
			let page = $(this).attr('data-page')
	    	if(page == 1 || ['',null,undefined].includes(page))
				query.skip = skip;
			else
				query.skip = ( (page-1)*25)
			
	    	getResult(query, token, page);

	    });

	}

	/*********************************************
	*
	*			job listing ends
	*
	**********************************************/

	/*********************************************
	*
	*			job post starts
	*
	**********************************************/
	function getJob(id){
		var token = getData('token');
		$.ajax({
			type : 'get',
			headers : { 
				'content-language' : 'en',
				//'authorization' : 'Bearer '+token
			},
			url : baseUrl + 'job/jobDetails?jobId='+id,
			success : function(resp){
				$('#job-title').append(resp.data.jobName)
				$('#job-name').text(resp.data.employer ? resp.data.employer.name:'')
				$('#job-desc').append(resp.data.description)
				var ul = ``;
				if(resp.data.experienceLevel.length > 0){
					resp.data.experienceLevel.forEach(function(item){
						let exp = item.replace("_", " "); 
						ul+=`<li><i class="simple-icon-clock"></i>${exp}</li>`;
					});
				}
				ul+=`<li>$ ${resp.data.startRange} - $ ${resp.data.endRange}</li>`;
				ul+=`<li><i class="simple-icon-location-pin"></i>${resp.data.address.text}</li>`;
				$('#details-ul').html(ul);
				$('#job-image').attr('src',resp.data.employer ? resp.data.employer.profilePic: '');
				$('#job-apply-btn').attr('data-id',resp.data._id);
				window.localStorage.setItem('_lastJob',JSON.stringify(resp));
			},
			fail: function(resp){
				toastr.error('request failed');
			},
			error: function(resp){
				toastr.error(resp.responseJSON.message);
			}
		})
	}
	if(typeof(is_jobPost) != "undefined" && is_jobPost !== null){
		var url_string = window.location.href;
		var url = new URL(url_string);
		var id = url.searchParams.get("id");
		
		getJob(id)
		

		$('#job-apply-btn').on('click',function(){
			var token = getData('token');
			var id = $(this).attr('data-id');
			if([null,undefined,''].includes(token)){
				//alert('Please login to apply.');
				toastr.error('Please login to apply.');
				return false;
			}else{
				
				$.ajax({
					type : 'put',
					url : baseUrl + 'job/applyJob',
					headers : { 
						'content-language' : 'en',
						'authorization' : 'Bearer '+token
					},
					data : {
						'jobId' : id,
					},
					success : function(resp){
						window.location.replace('./profile_step5.html?id='+id)
					},
					fail: function(resp){
						toastr.error('request failed');
					},
					error: function(resp){
						toastr.error(resp.responseJSON.message);
					}
				})
				
			}
		})

	}
	/*********************************************
	*
	*			job post ends 
	*
	**********************************************/


	/*********************************************
	*
	*			apply job post starts 
	*
	**********************************************/
	if(typeof(is_job_applied) != "undefined" && is_job_applied !== null){
		var url_string = window.location.href;
		var url = new URL(url_string);
		var id = url.searchParams.get("id");
		
		getJob(id);
	}
	/*********************************************
	*
	*			apply job post ends 
	*
	**********************************************/
	
});



if ($().dropzone && !$(".dropzone").hasClass("disabled")) {
  var token = localStorage.getItem("_obtoken");
  $(".dropzone").dropzone({
    url: "https://api.acquire.jobs/user/uploadFile",
    headers : { 
	    'content-language' : 'en',
	    'authorization' : 'Bearer '+token
	},
	paramName : 'image',
    init: function () {
      this.on("sending", function(file, xhr, formData){
                formData.append("type", filetype);
        });
      this.on("success", function (file, responseText) {
        fileUploaded = responseText.data[0]

      });
    },
    thumbnailWidth: 160,
    previewTemplate: '<div class="dz-preview dz-file-preview mb-3"><div class="d-flex flex-row "><div class="p-0 w-30 position-relative"><div class="dz-error-mark"><span><i></i></span></div><div class="dz-success-mark"><span><i></i></span></div><div class="preview-container"><img data-dz-thumbnail class="img-thumbnail border-0" /><i class="simple-icon-doc preview-icon" ></i></div></div><div class="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative"><div><span data-dz-name></span></div><div class="text-primary text-extra-small" data-dz-size /><div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div><div class="dz-error-message"><span data-dz-errormessage></span></div></div></div><a href="#/" class="remove" data-dz-remove><i class="glyph-icon simple-icon-trash"></i></a></div>'
  });
}