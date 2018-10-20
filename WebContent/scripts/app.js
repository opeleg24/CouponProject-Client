(function() {

	var app = angular.module("project", ["ngRoute"]);
	app.config(function($routeProvider){
		$routeProvider
		.when("/", {
			templateUrl : "./htm/login.htm"
		})
		.when("/company", {
			templateUrl : "./htm/Company.htm",
			resolve:{
				"check":function($location,$http,$window){  
					$http.post("/CouponProject/rest/company/").success(function(data){
						

					})
					.error(function(data,status) {

						if(status==401){
							
							alert("Access Not Authorized");
							$http.get("/CouponProject/rest/KillUnauthorisedSession").success(function(data){

							})
							.error(function(data) {
								$window.location.assign('/CouponProject/#');


							})

						} 


					})	

				}
			}
		})
		.when("/admin", {
			templateUrl : "./htm/Admin.htm",
			resolve:{
				"check":function($location,$http,$window){  
					$http.post("/CouponProject/rest/coupons/").success(function(data){
						

					})
					.error(function(data,status) {

						if(status==401){
							alert("Access Not Authorized");
							$http.get("/CouponProject/rest/KillUnauthorisedSession").success(function(data){

							})
							.error(function(data) {
								
								$window.location.assign('/CouponProject/#');


							})



						} 


					})			           
				}
			}
		})
		.when("/customer", {
			templateUrl : "./htm/Customer.htm",
			resolve:{
				"check":function($location,$http,$window){  
					$http.post("/CouponProject/rest/customer/").success(function(data){
					
					})
					.error(function(data,status) {

						if(status==401){
							
							alert("Access Not Authorized");
							$http.get("/CouponProject/rest/KillUnauthorisedSession").success(function(data){

							})
							.error(function(data) {
								
								$window.location.assign('/CouponProject/#');


							})



						} 


					})			           
				}
			}
		})
	})
//	--------------------------------------------Login Controller------------------------------------------------------------------------

	app.controller('LoginController', ['$http', '$scope', '$window', function($http, $scope, $window){


		this.login = function (){
			var user = JSON.stringify($scope.user);	

			$http.post('/CouponProject/rest/login',user).success(function(data){

				if ($scope.user.loginClientType=="COMPANY"){
					$window.location.assign('/CouponProject/#company');

				} 
				else if($scope.user.loginClientType=="ADMINISTRATOR"){
					$window.location.assign('/CouponProject/#admin');
				}
				else{
					$window.location.assign('/CouponProject/#customer');
				}				
			})
			.error(function(data) {

				alert(data.message);
			})
		}
	}])

//	--------------------------------------------Administrator Controller------------------------------------------------------------------------
	app.controller('AdminController', ['$http', '$scope','$window','$filter',function($http, $scope,$window,$filter){

//		--------------------------------------------Admin panel------------------------------------------------------------------------


		this.setTab = function(newValue){
			this.Tab = newValue;
		};

		this.isSet = function(tabName){
			return this.Tab === tabName;
		};
		this.AdminLogOut = function (){

			$http.get("/CouponProject/rest/coupons/getAdminIdSession/").success(function(data){
				
				$window.location.assign('/CouponProject/#');

			})
		


		}
		this.getAllCompanies=function(){
//			show=1:Table List of Companies
			$scope.show=1;
			$http.get("/CouponProject/rest/coupons/getAllCompanies").success(function(data){
				$scope.companies = data.company;

				if ($scope.companies.length == undefined){
					var arr = [];
					arr.push($scope.companies);
					$scope.companies = arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCompanyByCompanyId = function (){
//			This function closes the modal after the getCompanyByCompanyId function
			GetCompanyDetailsModal.style.display = 'none';


			$http.get("/CouponProject/rest/coupons/getCompanyByCompanyId/"+$scope.companyId).success(function(data){
				$scope.company = data;
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.deletePurchasedCouponsAndCompanyCouponsAndCompanyByCompanyId = function (companyId) {
			var result=confirm("Are you sure you want to delete this company?");
			if(result==true){
				function getSelectedIndex(companyId){
					for(var i=0;i<$scope.companies.length;i++)
						if($scope.companies[i].companyId==companyId)
							return i;
					return -1;
				}
				console.log(companyId);
				$http({
					method: 'DELETE', 
					url: "/CouponProject/rest/coupons/deletePurchasedCouponsAndCompanyCouponsAndCompanyByCompanyId/"+companyId,

				})

				.success(function(data){
					alert('Company was successfully removed, if this company had coupons and customers that have purchased them they are now removed!');
					console.log(companyId);
					$http.get("/CouponProject/rest/coupons/getAllCompanies").success(function(data){
						$scope.companies = data.company;

						if ($scope.companies.length == undefined){
							var arr = [];
							arr.push($scope.companies);
							$scope.companies = arr;
						}
					})
				})

				.error(function(data,status) {
					alert(data.message);
					if(status==401){
						alert("Your Session Expired");
						$window.location.assign('/CouponProject/#');

					} 
				})

			}
		};

		this.createCompany=function(){
//			This function closes the modal after the create company function
			CreateCompanyModal.style.display = 'none';

			var company = JSON.stringify($scope.company);
			$http.post("/CouponProject/rest/coupons/createCompany",company).success(function(data){
				alert('Company was Successfully created!');

				$http.get("/CouponProject/rest/coupons/getAllCompanies").success(function(data){
					$scope.companies = data.company;

					if ($scope.companies.length == undefined){
						var arr = [];
						arr.push($scope.companies);
						$scope.companies = arr;
					}
				})

			})
			.error(function(data,status) {
				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})


		}


		this.updateCompany = function (companyId){
//			This will remove the update form when the function works 
			UpdateCompanyModal.style.display = 'none';
			console.log(companyId);
			var companyID=companyId;
			$scope.companyUpdate = {};
			$scope.companyUpdate.companyId=$scope.companyId;
			$scope.companyUpdate.companyPassword=$scope.companyPassword
			$scope.companyUpdate.companyEmail=$scope.companyEmail

			$http.put("/CouponProject/rest/coupons/updateCompany",$scope.companyUpdate).success(function(data){
				alert("Company was Successfully updated");

				$http.get("/CouponProject/rest/coupons/getAllCompanies").success(function(data){
					$scope.companies = data.company;

					if ($scope.companies.length == undefined){
						var arr = [];
						arr.push($scope.companies);
						$scope.companies = arr;
					}
				})

			})
			.error(function(data,status) {
				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}

		this.getAllCustomers=function(){
//			show=3:Table List of Customers
			$scope.show=3;
			$http.get("/CouponProject/rest/coupons/getAllCustomers").success(function(data){
				$scope.customers = data.customer;

				if ($scope.customers.length == undefined){
					var arr = [];
					arr.push($scope.customers);
					$scope.customers = arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCustomerByCustomerId = function (){
//			This function closes the modal after the getCustomerByCustomerId function
			GetCustomerDetailsModal.style.display = 'none';
			$http.get("/CouponProject/rest/coupons/getCustomerByCustomerId/"+$scope.customerId).success(function(data){

				$scope.customer = data;
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}


		this.createCustomer=function(){
//			This function closes the modal after the create company function
			CreateCustomerModal.style.display = 'none';

			var customer = JSON.stringify($scope.customer);
			$http.post("/CouponProject/rest/coupons/createCustomer",customer).success(function(data){
				alert('Customer was Successfully created!');

				$http.get("/CouponProject/rest/coupons/getAllCustomers").success(function(data){
					$scope.customers = data.customer;

					if ($scope.customers.length == undefined){
						var arr = [];
						arr.push($scope.customers);
						$scope.customers = arr;
					}
				})

			})
			.error(function(data,status) {
				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 

			})

		}
		this.deleteCustomerAndCustomerPurchasedCouponsByCustomerId = function (customerId) {
			var result=confirm("Are you sure you want to delete this Customer?");
			if(result==true){
				function getSelectedIndex(customerId){
					for(var i=0;i<$scope.customers.length;i++)
						if($scope.customers[i].customerId==customerId)
							return i;
					return -1;
				}
				console.log(customerId);
				$http({
					method: 'DELETE', 
					url: "/CouponProject/rest/coupons/deleteCustomerAndCustomerPurchasedCouponsByCustomerId/"+customerId,

				})

				.success(function(data){
					alert('Customer was successfully removed, if this customer had purchased coupons they are now also removed!');
					console.log(customerId);
					$http.get("/CouponProject/rest/coupons/getAllCustomers").success(function(data){
						$scope.customers = data.customer;

						if ($scope.customers.length == undefined){
							var arr = [];
							arr.push($scope.customers);
							$scope.customers = arr;
						}
					})
				})
				.error(function(data,status) {
					alert(data.message);
					if(status==401){
						alert("Your Session Expired");
						$window.location.assign('/CouponProject/#');

					} 
				})

			}
		};

		this.updateCustomer = function (customerId){
//			This function closes the modal after the update customer function
			UpdateCustomerModal.style.display = 'none';
			console.log(customerId);
			var customerID=customerId;
			$scope.customerUpdate = {};
			$scope.customerUpdate.customerId=$scope.customerId;
			$scope.customerUpdate.customerPassword=$scope.customerPassword


			$http.put("/CouponProject/rest/coupons/updateCustomerOnlyCustomerPassword",$scope.customerUpdate).success(function(data){
				alert("Customer was Successfully updated");

				$http.get("/CouponProject/rest/coupons/getAllCustomers").success(function(data){
					$scope.customers = data.customer;

					if ($scope.customers.length == undefined){
						var arr = [];
						arr.push($scope.customers);
						$scope.customers = arr;
					}
				})

			})
			.error(function(data,status) {
				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}
//		AdminPage:CreateCompanyForm:
		// Get modal element
		var CreateCompanyModal = document.getElementById('simpleModalCreateCompany');
		// Get open modal button
		var modalBtnCreateCompany = document.getElementById('modalBtnCreateCompany');
		// Get close button
		var closeBtn = document.getElementsByClassName('closeBtn')[0];

		// Listen for open click
		modalBtnCreateCompany.addEventListener('click', openModalCreateCompany);
		// Listen for close click
		closeBtn.addEventListener('click', closeModalCreateCompany);
		// Listen for outside click
		window.addEventListener('click', outsideClickCreateCompanyModal);

		// Function to open modal
		function openModalCreateCompany(){
			CreateCompanyModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalCreateCompany(){
			CreateCompanyModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickCreateCompanyModal(e){
			if(e.target == CreateCompanyModal){
				CreateCompanyModal.style.display = 'none';
			}
		}
//		AdminPage:UpdateCompanyForm:

		var UpdateCompanyModal = document.getElementById('simpleModalUpdateCompany');
		// Get open modal button
		var UpdateCompanyModalBtn = document.getElementById('modalBtnUpdateCompany');
		// Get close button
		var UpdateCompanycloseBtn = document.getElementsByClassName('CloseButtonUpdateCompany')[0];

//		Listen for open click
//		UpdateCouponModalBtn.addEventListener('click', openModalUpdate);


////		// Listen for close click

		UpdateCompanycloseBtn.addEventListener('click', closeModalUpdateCompany);


		// Listen for outside click
		window.addEventListener('click', outsideClickUpdateCompany);

		// Function to open modal
		function openModalUpdateCompany(){
			UpdateCompanyModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalUpdateCompany(){
			UpdateCompanyModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickUpdateCompany(e){
			if(e.target == UpdateCompanyModal){
				UpdateCompanyModal.style.display = 'none';
			}
		}
		this.getUpdateCompanyModal=function(companyId){


//			$scope.showUpdateCompanyForm=true;
//			$scope.showCreateCompanyForm=false;
			var UpdateCompanyModal = document.getElementById('simpleModalUpdateCompany');
			UpdateCompanyModal.style.display = 'block';
			var index=getSelectedIndex(companyId);
			var company= $scope.companies[index];

			$scope.companyId=company.companyId;
			$scope.companyPassword=company.companyPassword;
			$scope.companyEmail=company.companyEmail;


			function getSelectedIndex(companyId){
				for(var i=0;i<$scope.companies.length;i++)
					if($scope.companies[i].companyId==companyId)
						return i;
				return -1;
			}  

		}
		this.getUpdateCustomerModal=function(customerId){

			var UpdateCustomerModal = document.getElementById('simpleModalUpdateCustomer');
			UpdateCustomerModal.style.display = 'block';
			var index=getSelectedIndex(customerId);
			var customer= $scope.customers[index];
			console.log(customerId);


			$scope.customerId=customer.customerId;
			$scope.customerPassword=customer.customerPassword;


			function getSelectedIndex(customerId){
				for(var i=0;i<$scope.customers.length;i++)
					if($scope.customers[i].customerId==customerId)
						return i;
				return -1;
			}  

		}

//		AdminPage:GetCompanyDetailsForm:
		// Get modal element
		var GetCompanyDetailsModal = document.getElementById('simpleModalGetCompanyDetails');
		// Get open modal button
		var GetCompanyDetailsModalButton = document.getElementById('modalBtnGetCompanyDetails');
		// Get close button
		var GetCompanyDetailscloseBtn = document.getElementsByClassName('CloseButtonGetCompanyDetails')[0];

		// Listen for open click
		GetCompanyDetailsModalButton.addEventListener('click', openModalGetCompanyDetails);
		// Listen for close click
		GetCompanyDetailscloseBtn.addEventListener('click', closeModalGetCompanyDetails);
		// Listen for outside click
		window.addEventListener('click', outsideClickGetCompanyDetails);

		// Function to open modal
		function openModalGetCompanyDetails(){
			GetCompanyDetailsModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalGetCompanyDetails(){
			GetCompanyDetailsModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickGetCompanyDetails(e){
			if(e.target == GetCompanyDetailsModal){
				GetCompanyDetailsModal.style.display = 'none';
			}
		}
//		AdminPage:CreateCustomerForm:
		// Get modal element
		var CreateCustomerModal = document.getElementById('simpleModalCreateCustomer');
		// Get open modal button
		var modalBtnCreateCustomer = document.getElementById('modalBtnCreateCustomer');
		// Get close button
		var CreateCustomercloseBtn = document.getElementsByClassName('CloseButtonCreateCustomer')[0];

		// Listen for open click
		modalBtnCreateCustomer.addEventListener('click', openModalCreateCustomer);
		// Listen for close click
		CreateCustomercloseBtn.addEventListener('click', closeModalCreateCustomer);
		// Listen for outside click
		window.addEventListener('click', outsideClickCreateCustomerModal);

		// Function to open modal
		function openModalCreateCustomer(){
			CreateCustomerModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalCreateCustomer(){
			CreateCustomerModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickCreateCustomerModal(e){
			if(e.target == CreateCustomerModal){
				CreateCustomerModal.style.display = 'none';
			}
		}
//		AdminPage:UpdateCustomerForm:

		var UpdateCustomerModal = document.getElementById('simpleModalUpdateCustomer');
		// Get open modal button
		var UpdateCustomerModaleBtn = document.getElementById('modalBtnUpdateCustomer');
		// Get close button
		var UpdateCustomercloseBtn = document.getElementsByClassName('CloseButtonUpdateCustomer')[0];

//		Listen for open click
//		UpdateCouponModalBtn.addEventListener('click', openModalUpdate);


////		// Listen for close click

		UpdateCustomercloseBtn.addEventListener('click', closeModalUpdateCustomer);


		// Listen for outside click
		window.addEventListener('click', outsideClickUpdateCustomer);

		// Function to open modal
		function openModalUpdateCustomer(){
			UpdateCustomerModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalUpdateCustomer(){
			UpdateCustomerModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickUpdateCustomer(e){
			if(e.target == UpdateCustomerModal){
				UpdateCustomerModal.style.display = 'none';
			}
		}
//		AdminPage:GetCustomerDetailsForm:
		// Get modal element
		var GetCustomerDetailsModal = document.getElementById('simpleModalGetCustomerDetails');
		// Get open modal button
		var GetCustomerDetailsModalButton = document.getElementById('modalBtnGetCustomerDetails');
		// Get close button
		var GetCustomerDetailscloseBtn = document.getElementsByClassName('CloseButtonGetCustomerDetails')[0];

		// Listen for open click
		GetCustomerDetailsModalButton.addEventListener('click', openModalGetCustomerDetails);
		// Listen for close click
		GetCustomerDetailscloseBtn.addEventListener('click', closeModalGetCustomerDetails);
		// Listen for outside click
		window.addEventListener('click', outsideClickGetCustomerDetails);

		// Function to open modal
		function openModalGetCustomerDetails(){
			GetCustomerDetailsModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalGetCustomerDetails(){
			GetCustomerDetailsModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickGetCustomerDetails(e){
			if(e.target == GetCustomerDetailsModal){
				GetCustomerDetailsModal.style.display = 'none';
			}
		}

//		--------------------------------------------Company panel------------------------------------------------------------------------

		this.getAllCouponsByCompanyId = function (){

//			This function closes the modal after the getAllCouponsByCompanyId function
			GetCompanyCouponsModal.style.display = 'none';


			$http.get("/CouponProject/rest/coupons/getAllCouponsByCompanyId/?companyId="+$scope.companyId).success(function(data){
				console.log($scope.companyId);
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

				$scope.showAdminCreateCouponButton=true;


			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})


		}		

		this.createCouponByCompanyId = function (){

//			This function closes the modal after the createCouponByCompanyId function
			AdminCreateCouponModal.style.display = 'none';

			$scope.couponCreate = {};
			$scope.couponCreate.couponId=$scope.coupon.couponId
			$scope.couponCreate.couponTitle=$scope.coupon.couponTitle
			$scope.couponCreate.companyId=$scope.companyId
			$scope.couponCreate.startDate = $filter('date')($scope.coupon.startDate, "dd-MM-yyyy");
			$scope.couponCreate.endDate = $filter('date')($scope.coupon.endDate, "dd-MM-yyyy");
			$scope.couponCreate.couponAmount=$scope.coupon.couponAmount
			$scope.couponCreate.couponType=$scope.coupon.couponType
			$scope.couponCreate.message=$scope.coupon.message
			$scope.couponCreate.price=$scope.coupon.price
			$scope.couponCreate.image=$scope.coupon.image
			console.log($scope.couponCreate);

			$http.post("/CouponProject/rest/coupons/createCouponByCompanyId",$scope.couponCreate).success(function(data){
				alert('Coupon was Successfully created!');
				$http.get("/CouponProject/rest/coupons/getAllCouponsByCompanyId/?companyId="+$scope.companyId).success(function(data){
					console.log($scope.companyId);
					$scope.coupons = data.coupon;

					if ($scope.coupons.length == undefined){
						var arr = [];
						arr.push($scope.coupons);
						$scope.coupons = arr;
					}

				})

			})
			.error(function(data,status) {
				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		};

		this.deleteCouponAndDeleteCouponsPurchasedByCustomer = function (couponId) {

			var result=confirm("Are you sure you want to delete this coupon?");
			if(result==true){
				function getSelectedIndex(couponId){
					for(var i=0;i<$scope.coupons.length;i++)
						if($scope.coupons[i].couponId==couponId)
							return i;
					return -1;
				}

				$http({
					method: 'DELETE', 
					url: "/CouponProject/rest/coupons/deleteCouponAndDeleteCouponsPurchasedByCustomer/"+couponId+"/?companyId="+$scope.companyId,


				})

				.success(function(data){
					alert('Coupon was Successfully removed, All Coupons purchased by customers are now also removed!');
					console.log(couponId);
					$http.get("/CouponProject/rest/coupons/getAllCouponsByCompanyId/?companyId="+$scope.companyId).success(function(data){
						console.log($scope.companyId);
						$scope.coupons = data.coupon;

						if ($scope.coupons.length == undefined){
							var arr = [];
							arr.push($scope.coupons);
							$scope.coupons = arr;
						}

					})
				})
				.error(function(data,status) {
					alert(data.message);
					if(status==401){
						alert("Your Session Expired");
						$window.location.assign('/CouponProject/#');

					} 
				})

			}
		};	
		this.updateCoupon = function (couponId){
//			This function closes the modal after the getCouponUpdateModal function
			AdminUpdateCouponModal.style.display = 'none';
			$scope.couponUpdate = {};
			$scope.couponUpdate.couponId=$scope.couponId
			$scope.couponUpdate.couponTitle=$scope.couponTitle
			$scope.couponUpdate.companyId=$scope.companyId
			$scope.couponUpdate.startDate=$filter('date')($scope.startDate, "dd-MM-yyyy");
			$scope.couponUpdate.endDate=$filter('date')($scope.endDate, "dd-MM-yyyy");
			$scope.couponUpdate.couponAmount=$scope.couponAmount
			$scope.couponUpdate.couponType=$scope.couponType
			$scope.couponUpdate.message=$scope.message
			$scope.couponUpdate.price=$scope.price
			$scope.couponUpdate.image=$scope.image
			console.log($scope.couponUpdate);

			$http.put("/CouponProject/rest/coupons/updateCouponByCompanyId/?companyId="+$scope.companyId,$scope.couponUpdate).success(function(data){
				alert("Coupon was Successfully updated");

				$http.get("/CouponProject/rest/coupons/getAllCouponsByCompanyId/?companyId="+$scope.companyId).success(function(data){
					console.log($scope.companyId);
					$scope.coupons = data.coupon;

					if ($scope.coupons.length == undefined){
						var arr = [];
						arr.push($scope.coupons);
						$scope.coupons = arr;
					}

				})

			})
			.error(function(data,status) {
				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}

		this.backToGetAllCompanyCouponsByCompanyId = function (){


			$http.get("/CouponProject/rest/coupons/getAllCouponsByCompanyId/?companyId="+$scope.companyId).success(function(data){
				console.log($scope.companyId);
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCompanyIdAndCouponType = function (){

			$http.get("/CouponProject/rest/coupons/getCouponsByCompanyAndCouponType/?companyId="+$scope.companyId+"&CouponType="+$scope.CouponType).success(function(data){
				$scope.coupons= data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		$scope.startPrice  = 0.00;
		this.getCouponsByCompanyIdAndStartPriceAndLimitPrice = function (){
			$http.get("/CouponProject/rest/coupons/getCouponsByCompanyIdAndStartPriceAndLimitPrice/?companyId="+$scope.companyId+"&startPrice="+$scope.startPrice+"&limitPrice="+$scope.limitPrice).success(function(data){
				$scope.coupons = data.coupon;


				function setTwoNumberDecimal(event) {
					this.value = parseFloat(this.value).toFixed(2);
				}
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCompanyIdAndStartDateStartAndEndDateLimit = function (){
			$scope.formattStartDateStart = $filter('date')($scope.startDateStart, "dd-MM-yyyy");
			$scope.formattStartDateLimit = $filter('date')($scope.startDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/coupons/getCouponsByCompanyIdAndStartDateStartAndEndDateLimit/?companyId="+$scope.companyId+"&startDateStart="+$scope.formattStartDateStart+"&startDateLimit="+$scope.formattStartDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.startDateStart);
				console.log($scope.formattStartDateStart);
				console.log($scope.formattStartDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}		
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})


		}
		this.getCouponsByCompanyIdAndEndDateStartAndEndDateLimit = function (){
			$scope.formatteEndDateStart = $filter('date')($scope.endDateStart, "dd-MM-yyyy");
			$scope.formatteEndDateLimit = $filter('date')($scope.endDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/coupons/getCouponsByCompanyIdAndEndDateStartAndEndDateLimit/?companyId="+$scope.companyId+"&endDateStart="+$scope.formatteEndDateStart+"&endDateLimit="+$scope.formatteEndDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.formatteEndDateStart);
				console.log($scope.formatteEndDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}			

		this.getCompanyDetails = function (){

			$http.get("/CouponProject/rest/coupons/getCompany/?companyId="+$scope.companyId).success(function(data){
				$scope.company = data;
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
//		AdminPage:GetCompany:
		// Get modal element
		var GetCompanyCouponsModal = document.getElementById('simpleModalGetCompanyCoupons');
		// Get open modal button
		var GetCompanyCouponsModalButton = document.getElementById('modalBtnGetCompanyCoupons');
		// Get close button
		var GetCompanyCouponscloseBtn = document.getElementsByClassName('CloseButtonGetCompanyCoupons')[0];

		// Listen for open click
		GetCompanyCouponsModalButton.addEventListener('click', openModalGetCompanyCoupons);
		// Listen for close click
		GetCompanyCouponscloseBtn.addEventListener('click', closeModalGetCompanyCoupons);
		// Listen for outside click

		window.addEventListener('click', outsideClickGetCompanyCoupons);
		// Function to open modal
		function openModalGetCompanyCoupons(){
			GetCompanyCouponsModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalGetCompanyCoupons(){
			GetCompanyCouponsModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickGetCompanyCoupons(e){
			if(e.target == GetCompanyCouponsModal){
				GetCompanyCouponsModal.style.display = 'none';
			}
		}
//		AdminPage:CreateCouponForm:

		// Get modal element
		var AdminCreateCouponModal = document.getElementById('simpleModalCreateCoupon');
		// Get open modal button
		var AdminCreateCouponModalmodalBtn = document.getElementById('modalBtnAdminCreateCoupon');
		// Get close button
		var AdminCreateCouponModalcloseBtn = document.getElementsByClassName('CloseButtonAdminCreateCoupon ')[0];

		// Listen for open click
		AdminCreateCouponModalmodalBtn.addEventListener('click', AdminCreateCouponOpenModal);
		// Listen for close click
		AdminCreateCouponModalcloseBtn.addEventListener('click', AdminCreateCouponCloseModal);
		// Listen for outside click
		window.addEventListener('click', outsideClickAdminCreateCouponModal);

		// Function to open modal
		function AdminCreateCouponOpenModal(){
			AdminCreateCouponModal.style.display = 'block';
		}

		// Function to close modal
		function AdminCreateCouponCloseModal(){
			AdminCreateCouponModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickAdminCreateCouponModal(e){
			if(e.target == AdminCreateCouponModal){
				AdminCreateCouponModal.style.display = 'none';
			}
		}
		this.getCouponUpdateModal= function (couponId){


			var AdminUpdateCouponModal = document.getElementById('simpleModalAdminUpdateCoupon');
			AdminUpdateCouponModal.style.display = 'block';
			var index=getSelectedIndex(couponId);
			var coupon= $scope.coupons[index];

			$scope.couponId=coupon.couponId;
			$scope.couponTitle=coupon.couponTitle;
			$scope.companyId=coupon.companyId;
			$scope.startDate = coupon.startDate;
			$scope.endDate=coupon.endDate;
			$scope.couponAmount=coupon.couponAmount;
			$scope.couponType=coupon.couponType;
			$scope.message=coupon.message;
			$scope.price=coupon.price;
			$scope.image=coupon.image;

			function getSelectedIndex(couponId){
				for(var i=0;i<$scope.coupons.length;i++)
					if($scope.coupons[i].couponId==couponId)
						return i;
				return -1;
			}  


		}
//		/		AdminPage,company panel:UpdateCoupon:

		var AdminUpdateCouponModal = document.getElementById('simpleModalAdminUpdateCoupon');
		// Get open modal button
		var AdminUpdateCouponModalBtn = document.getElementById('modalBtnAdminUpdateCoupon');
		// Get close button
		var AdminUpdateCouponModalcloseBtn = document.getElementsByClassName('closeBtnAdminUpdateCoupon')[0];


////		// Listen for close click

		AdminUpdateCouponModalcloseBtn.addEventListener('click', closeModalAdminUpdateCoupon);


		// Listen for outside click
		window.addEventListener('click', outsideClickAdminUpdateCoupon);

		// Function to open modal
		function openModalAdminUpdateCoupon(){
			AdminUpdateCouponModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalAdminUpdateCoupon(){
			AdminUpdateCouponModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickAdminUpdateCoupon(e){
			if(e.target == AdminUpdateCouponModal){
				AdminUpdateCouponModal.style.display = 'none';
			}
		}


//		--------------------------------------------Customer panel------------------------------------------------------------------------
		$scope.startPriceCustomer  = 0.00;

		this.getAllCouponsByCustomerId = function (){
//			This function closes the modal after the getAllCouponsByCustomerId function
			PurchaseCouponsModal.style.display = 'none';



			$http.get("/CouponProject/rest/coupons/getCouponsByCustomerId/?customerId="+$scope.customerId).success(function(data){

				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}	
		this.allCouponsButtonByCustomerId = function (){

			$http.get("/CouponProject/rest/coupons/getCouponsByCustomerId/?customerId="+$scope.customerId).success(function(data){
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}
		this.getAllCouponsByStartPriceAndLimitPriceByCustomerId = function (){

			$http.get("/CouponProject/rest/coupons/getAllCouponsByStartPriceAndLimitPriceByCustomerId/?startPrice="+$scope.startPriceCustomer+"&limitPrice="+$scope.limitPriceCustomer+"&customerId="+$scope.customerId).success(function(data){
				$scope.coupons = data.coupon;

				function setTwoNumberDecimal(event) {
					this.value = parseFloat(this.value).toFixed(2);
				}
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByStartDateStartAndEndDateLimitByCustomerId = function (){
			$scope.formattStartDateStart = $filter('date')($scope.startDateStart, "dd-MM-yyyy");
			$scope.formattStartDateLimit = $filter('date')($scope.startDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/coupons/getCouponsByStartDateStartAndEndDateLimitByCustomerId/?startDateStart="+$scope.formattStartDateStart+"&startDateLimit="+$scope.formattStartDateLimit+"&customerId="+$scope.customerId).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.startDateStart);
				console.log($scope.formattStartDateStart);
				console.log($scope.formattStartDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}		
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCouponsByEndDateStartAndEndDateLimitByCustomerId = function (){
			$scope.formatteEndDateStart = $filter('date')($scope.endDateStart, "dd-MM-yyyy");
			$scope.formatteEndDateLimit = $filter('date')($scope.endDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/coupons/getCouponsByEndDateStartAndEndDateLimiByCustomerId/?endDateStart="+$scope.formatteEndDateStart+"&endDateLimit="+$scope.formatteEndDateLimit+"&customerId="+$scope.customerId).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.formatteEndDateStart);
				console.log($scope.formatteEndDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCouponsByCouponTypeByCustomerId = function (){
			$http.get("/CouponProject/rest/coupons/getCouponsByCouponTypeByCustomerId/?CouponType="+$scope.CouponType+"&customerId="+$scope.customerId).success(function(data){
				$scope.coupons= data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.purchaseCoupon = function (couponId) {

			var result=confirm("Are you sure you want to purchase this coupon?");
			if(result==true){
				function getSelectedIndex(couponId){
					for(var i=0;i<$scope.coupons.length;i++)
						if($scope.coupons[i].couponId==couponId)
							return i;
					return -1;
				}
				$http.post("/CouponProject/rest/coupons/purchaseCoupon/?customerId="+$scope.customerId+"&couponId="+couponId).success(function(data){
					alert('You Successfully purchased CouponID= '+couponId);

					$http.get("/CouponProject/rest/coupons/getCouponsByCustomerId/?customerId="+$scope.customerId).success(function(data){

						$scope.coupons = data.coupon;

						if ($scope.coupons.length == undefined){
							var arr = [];
							arr.push($scope.coupons);
							$scope.coupons = arr;
						}

					})
					.error(function(data,status) {

						if(status==401){
							alert("Your Session Expired");
							$window.location.assign('/CouponProject/#');

						} 
					})

				})
				.error(function(data,status) {
					alert(data.message);
					if(status==401){
						alert("Your Session Expired");
						$window.location.assign('/CouponProject/#');

					} 
				})

			}
		};
		this.getPurchasedCouponsByCustomerId = function (){
//			This function closes the modal after the getPurchasedCouponsByCustomerId function
			GetPurchasedCouponsModal.style.display = 'none';

			$http.get("/CouponProject/rest/coupons/getPurchasedCouponsByCustomerId/?customerId="+$scope.customerIdOfPurchasedCoupons).success(function(data){
				$scope.Coupons = data.coupon;

				if ($scope.Coupons.length == undefined){
					var arr = [];
					arr.push($scope.Coupons);
					$scope.Coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getAmountOfPurchasedCouponsByCustomerIdAndCouponId=function(couponId){
			console.log(couponId);
			console.log($scope.customerIdOfPurchasedCoupons);

			function GetSelectedIndex(couponId){
				for(var i=0;i<$scope.Coupons.length;i++)
					if($scope.Coupons[i].couponId==couponId)
						return i;
				return -1;
			}
			$http.get("/CouponProject/rest/coupons/getAmountOfPurchasedCouponsByCustomerIdAndCouponId/?customerId="+$scope.customerIdOfPurchasedCoupons+"&couponId="+couponId).success(function(data){
				$scope.AmountOfPurchasedCoupons = data;
				alert('You have Purchased '+'('+$scope.AmountOfPurchasedCoupons+')'+' Amount of This coupon');
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}

		this.backToGetAllCustomerCouponsByCustomerId = function (){


			$http.get("/CouponProject/rest/coupons/getPurchasedCouponsByCustomerId/?customerId="+$scope.customerIdOfPurchasedCoupons).success(function(data){

				$scope.Coupons = data.coupon;

				if ($scope.Coupons.length == undefined){
					var arr = [];
					arr.push($scope.Coupons);
					$scope.Coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}
		this.getCouponsByCustomerIdAndCouponType = function (){
			$http.get("/CouponProject/rest/coupons/getPurchasedCouponsByCustomerIdCouponType/?customerId="+$scope.customerIdOfPurchasedCoupons+"&CouponType="+$scope.CouponType).success(function(data){
				$scope.Coupons = data.coupon;

				if ($scope.Coupons.length == undefined){
					var arr = [];
					arr.push($scope.Coupons);
					$scope.Coupons = arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCouponsByCustomerIdAndStartPriceAndLimitPrice = function (){
			$http.get("/CouponProject/rest/coupons/getAllPurchasedCouponsByCustomerIdAndStartPriceAndLimitPrice/?customerId="+$scope.customerIdOfPurchasedCoupons+"&startPrice="+$scope.startPrice+"&limitPrice="+$scope.limitPrice).success(function(data){
				$scope.Coupons = data.coupon;

				function setTwoNumberDecimal(event) {
					this.value = parseFloat(this.value).toFixed(2);
				}

				if ($scope.Coupons.length == undefined){
					var arr = [];
					arr.push($scope.Coupons);
					$scope.Coupons = arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCouponsByCustomerIdAndStartDateStartAndEndDateLimit = function (){
			$scope.formattStartDateStart = $filter('date')($scope.startDateStart, "dd-MM-yyyy");
			$scope.formattStartDateLimit = $filter('date')($scope.startDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/coupons/getCouponsByCustomerIdAndStartDateStartAndEndDateLimit/?customerId="+$scope.customerIdOfPurchasedCoupons+"&startDateStart="+$scope.formattStartDateStart+"&startDateLimit="+$scope.formattStartDateLimit).success(function(data){
				$scope.Coupons = data.coupon;

				if ($scope.Coupons.length == undefined){
					var arr = [];
					arr.push($scope.Coupons);
					$scope.Coupons = arr;
				}		
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCustomerIdAndEndDateStartAndEndDateLimit = function (){
			$scope.formatteEndDateStart = $filter('date')($scope.endDateStart, "dd-MM-yyyy");
			$scope.formatteEndDateLimit = $filter('date')($scope.endDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/coupons/getCouponsByCustomerIdAndEndDateStartAndEndDateLimit/?customerId="+$scope.customerIdOfPurchasedCoupons+"&endDateStart="+$scope.formatteEndDateStart+"&endDateLimit="+$scope.formatteEndDateLimit).success(function(data){
				$scope.Coupons = data.coupon;

				if ($scope.Coupons.length == undefined){
					var arr = [];
					arr.push($scope.Coupons);
					$scope.Coupons = arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

//		AdminPage:PurchaseCoupons:

		// Get modal element
		var PurchaseCouponsModal = document.getElementById('simpleModalPurchaseCoupons');
		// Get open modal button
		var PurchaseCouponsBtn = document.getElementById('modalBtnPurchaseCoupons');
		// Get close button
		var PurchaseCouponsCloseBtn = document.getElementsByClassName('closeBtnPurchaseCoupons')[0];

		// Listen for open click
		PurchaseCouponsBtn.addEventListener('click', PurchaseCouponsOpenModal);
		// Listen for close click
		PurchaseCouponsCloseBtn.addEventListener('click', PurchaseCouponsCloseModal);
		// Listen for outside click
		window.addEventListener('click', outsideClickPurchaseCoupons);

		// Function to open modal
		function PurchaseCouponsOpenModal(){
			PurchaseCouponsModal.style.display = 'block';
		}

		// Function to close modal
		function PurchaseCouponsCloseModal(){
			PurchaseCouponsModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickPurchaseCoupons(e){
			if(e.target == PurchaseCouponsModal){
				PurchaseCouponsModal.style.display = 'none';
			}
		}

//		AdminPage:GetPurchasedCoupons:

		// Get modal element
		var GetPurchasedCouponsModal = document.getElementById('simpleModalGetPurchasedCoupons');
		// Get open modal button
		var GetPurchasedCouponssBtn = document.getElementById('modalBtnGetPurchasedCoupons');
		// Get close button
		var GetPurchasedCouponsCloseBtn = document.getElementsByClassName('closeBtnGetPurchasedCoupons')[0];

		// Listen for open click
		GetPurchasedCouponssBtn.addEventListener('click', GetPurchasedCouponsOpenModal);
		// Listen for close click
		GetPurchasedCouponsCloseBtn.addEventListener('click', GetPurchasedCouponsCloseModal);
		// Listen for outside click
		window.addEventListener('click', outsideClickGetPurchasedCoupons);

		// Function to open modal
		function GetPurchasedCouponsOpenModal(){
			GetPurchasedCouponsModal.style.display = 'block';
		}

		// Function to close modal
		function GetPurchasedCouponsCloseModal(){
			GetPurchasedCouponsModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickGetPurchasedCoupons(e){
			if(e.target == GetPurchasedCouponsModal){
				GetPurchasedCouponsModal.style.display = 'none';
			}
		}



	}])




	//--------------------------------------------Customer Controller------------------------------------------------------------------------
	app.controller('CustomerController', ['$http', '$scope','$window','$filter', function($http, $scope,$window, $filter){
		$scope.startPriceCustomer  = 0.00;
		this.setTab = function(newValue){
			this.custController = newValue;
		};
		this.CustomerLogOut = function (){

			$http.get("/CouponProject/rest/customer/getCustomerIdSession/").success(function(data){	
				
				$window.location.assign('/CouponProject/#');

			})
			


		}

		this.isSet = function(tabName){
			return this.custController === tabName;
		};
		this.getCouponsByCustomerId = function (){

			this.setTab(1)
			this.isSet(1)
			$http.get("/CouponProject/rest/customer/getCouponsByCustomerId").success(function(data){
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}
		this.allCouponsButtonByCustomerId = function (){

			$http.get("/CouponProject/rest/customer/getCouponsByCustomerId").success(function(data){
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}
		this.getAllCouponsByStartPriceAndLimitPriceByCustomerId = function (){

			$http.get("/CouponProject/rest/customer/getAllCouponsByStartPriceAndLimitPriceByCustomerId/?startPrice="+$scope.startPriceCustomer+"&limitPrice="+$scope.limitPriceCustomer).success(function(data){
				$scope.coupons = data.coupon;

				function setTwoNumberDecimal(event) {
					this.value = parseFloat(this.value).toFixed(2);
				}
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByStartDateStartAndEndDateLimitByCustomerId = function (){
			$scope.formattStartDateStart = $filter('date')($scope.startDateStart, "dd-MM-yyyy");
			$scope.formattStartDateLimit = $filter('date')($scope.startDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/customer/getCouponsByStartDateStartAndEndDateLimitByCustomerId/?startDateStart="+$scope.formattStartDateStart+"&startDateLimit="+$scope.formattStartDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.startDateStart);
				console.log($scope.formattStartDateStart);
				console.log($scope.formattStartDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}		
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCouponsByEndDateStartAndEndDateLimitByCustomerId = function (){
			$scope.formatteEndDateStart = $filter('date')($scope.endDateStart, "dd-MM-yyyy");
			$scope.formatteEndDateLimit = $filter('date')($scope.endDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/customer/getCouponsByEndDateStartAndEndDateLimiByCustomerId/?endDateStart="+$scope.formatteEndDateStart+"&endDateLimit="+$scope.formatteEndDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.formatteEndDateStart);
				console.log($scope.formatteEndDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCouponsByCouponTypeByCustomerId = function (){
			$http.get("/CouponProject/rest/customer/getCouponsByCouponTypeByCustomerId/?CouponType="+$scope.CouponType).success(function(data){
				$scope.coupons= data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}



		this.purchaseCoupon = function (couponId) {

			var result=confirm("Are you sure you want to purchase this coupon?");
			if(result==true){
				function getSelectedIndex(couponId){
					for(var i=0;i<$scope.coupons.length;i++)
						if($scope.coupons[i].couponId==couponId)
							return i;
					return -1;
				}
				$http.post("/CouponProject/rest/customer/purchaseCoupon/"+couponId).success(function(data){
					alert('You Successfully purchased CouponID= '+couponId);
					console.log(couponId);
					$http.get("/CouponProject/rest/customer/getCouponsByCustomerId").success(function(data){
						$scope.coupons = data.coupon;

						if ($scope.coupons.length == undefined){
							var arr = [];
							arr.push($scope.coupons);
							$scope.coupons = arr;
						}

					})


				})
				.error(function(data,status) {

					alert(data.message);
					if(status==401){
						alert("Your Session Expired");
						$window.location.assign('/CouponProject/#');

					} 
				})
			}
		};
		this.getPurchasedCouponsByCustomerId = function (couponId){

			this.setTab(2)
			this.isSet(2)
			$http.get("/CouponProject/rest/customer/getPurchasedCouponsByCustomerId").success(function(data){
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})



		}
		this.backToGetAllCustomerCouponsByCustomerId = function (){

			$http.get("/CouponProject/rest/customer/getPurchasedCouponsByCustomerId").success(function(data){
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}
		this.getAmountOfPurchasedCouponsByCustomerIdAndCouponId=function(couponId){

			function getSelectedIndex(couponId){
				for(var i=0;i<$scope.coupons.length;i++)
					if($scope.coupons[i].couponId==couponId)
						return i;
				return -1;
			}
			$http.get("/CouponProject/rest/customer/getAmountOfPurchasedCouponsByCustomerIdAndCouponId/"+couponId).success(function(data){
				$scope.AmountOfPurchasedCoupons = data;
				alert('You have Purchased '+'('+$scope.AmountOfPurchasedCoupons+')'+' Amount of This coupon');
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}


		this.getCouponsByCustomerIdAndCouponType = function (){
			$http.get("/CouponProject/rest/customer/getPurchasedCouponsByCustomerIdCouponType/?CouponType="+$scope.CouponType).success(function(data){
				$scope.coupons= data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCustomerIdAndStartPriceAndLimitPrice = function (){
			$http.get("/CouponProject/rest/customer/getAllPurchasedCouponsByCustomerIdAndStartPriceAndLimitPrice/?startPrice="+$scope.startPriceCustomer+"&limitPrice="+$scope.limitPriceCustomer).success(function(data){
				$scope.coupons = data.coupon;

				function setTwoNumberDecimal(event) {
					this.value = parseFloat(this.value).toFixed(2);
				}
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCustomerDetails = function (){

			this.setTab(3)
			this.isSet(3)
			$http.get("/CouponProject/rest/customer/getCustomer/").success(function(data){
				$scope.customer = data;
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}

		this.getCouponsByCustomerIdAndStartDateStartAndEndDateLimit = function (){
			$scope.formattStartDateStart = $filter('date')($scope.startDateStart, "dd-MM-yyyy");
			$scope.formattStartDateLimit = $filter('date')($scope.startDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/customer/getCouponsByCustomerIdAndStartDateStartAndEndDateLimit/?startDateStart="+$scope.formattStartDateStart+"&startDateLimit="+$scope.formattStartDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.startDateStart);
				console.log($scope.formattStartDateStart);
				console.log($scope.formattStartDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}		
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCustomerIdAndEndDateStartAndEndDateLimit = function (){
			$scope.formatteEndDateStart = $filter('date')($scope.endDateStart, "dd-MM-yyyy");
			$scope.formatteEndDateLimit = $filter('date')($scope.endDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/customer/getCouponsByCustomerIdAndEndDateStartAndEndDateLimit/?endDateStart="+$scope.formatteEndDateStart+"&endDateLimit="+$scope.formatteEndDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.formatteEndDateStart);
				console.log($scope.formatteEndDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}


	}])

	//--------------------------------------------Company Controller------------------------------------------------------------------------
	app.controller('CompanyController', ['$http', '$scope','$window' ,'$filter', function($http, $scope, $window ,$filter){
		$scope.startPrice  = 0.00;

		this.setTab = function(newValue){
			this.compController = newValue;
		};

		this.isSet = function(tabName){
			return this.compController === tabName;
		};
		
		this.CompanyLogOut = function (){

			$http.get("/CouponProject/rest/company/getCompanyIdSession/").success(function(data){	

				$window.location.assign('/CouponProject/#');
			})
			


		}
		this.getCompanyDetails = function (){


			this.setTab(1)
			this.isSet(1)

			$http.get("/CouponProject/rest/company/getCompany").success(function(data){
				$scope.company = data;
			})

			.error(function(data, status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 

			})
		}

		this.getCompanyCouponsByCompanyId = function (){

			this.setTab(2)
			this.isSet(2)
			$http.get("/CouponProject/rest/company/getCouponsByCompany").success(function(data){
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data, status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 

			})
		}
		this.backToGetAllCompanyCouponsByCompanyId = function (){

			$http.get("/CouponProject/rest/company/getCouponsByCompany").success(function(data){
				$scope.coupons = data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons = arr;
				}

			})
			.error(function(data, status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 

			})


		};

//		CompanyPage:CreateCouponForm:
		// Get modal element
		var CreateCouponModal = document.getElementById('simpleModal');
		// Get open modal button
		var modalBtn = document.getElementById('modalBtn');
		// Get close button
		var closeBtn = document.getElementsByClassName('closeBtn')[0];

		// Listen for open click
		modalBtn.addEventListener('click', openModal);
		// Listen for close click
		closeBtn.addEventListener('click', closeModal);
		// Listen for outside click
		window.addEventListener('click', outsideClick);

		// Function to open modal
		function openModal(){
			CreateCouponModal.style.display = 'block';
		}

		// Function to close modal
		function closeModal(){
			CreateCouponModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClick(e){
			if(e.target == CreateCouponModal){
				CreateCouponModal.style.display = 'none';
			}
		}



//		CompanyPage:UpdateForm:
		// Get modal element

		this.getUpdateModel = function(couponId){
			console.log(couponId);
			var UpdateCouponModal = document.getElementById('simpleModalUpdateCoupon');
			UpdateCouponModal.style.display = 'block';
			var index=getSelectedIndex(couponId);
			var coupon= $scope.coupons[index];
			$scope.couponId=coupon.couponId;
			$scope.couponTitle=coupon.couponTitle;
			$scope.companyId=coupon.companyId;
			$scope.startDate = $filter('date')(coupon.startDate, "yyyy-MM-dd");
			console.log($scope.startDate);
			$scope.endDate=coupon.endDate;
			$scope.couponAmount=coupon.couponAmount;
			$scope.couponType=coupon.couponType;
			$scope.message=coupon.message;
			$scope.price=coupon.price;
			$scope.image=coupon.image;

			function getSelectedIndex(couponId){
				for(var i=0;i<$scope.coupons.length;i++)
					if($scope.coupons[i].couponId==couponId)
						return i;
				return -1;
			}  
		}

		var UpdateCouponModal = document.getElementById('simpleModalUpdateCoupon');
		// Get open modal button
		//var UpdateCouponModalBtn = document.getElementById('modalBtnUpdateCoupon');
		// Get close button
		var UpdateCouponcloseBtn = document.getElementsByClassName('closeBtnUpdateCoupon')[0];

		// Listen for open click
		//UpdateCouponModalBtn.addEventListener('click', openModalUpdate);
		// Listen for close click
		UpdateCouponcloseBtn.addEventListener('click', closeModalUpdate);
		// Listen for outside click
		window.addEventListener('click', outsideClickUpdateCoupon);

		// Function to open modal
		function openModalUpdate(){
			UpdateCouponModal.style.display = 'block';
		}

		// Function to close modal
		function closeModalUpdate(){
			UpdateCouponModal.style.display = 'none';
		}

		// Function to close modal if outside click
		function outsideClickUpdateCoupon(e){
			if(e.target == UpdateCouponModal){
				UpdateCouponModal.style.display = 'none';
			}
		}

		this.createCoupon = function (){

//			function to close modal after the create form function 
			CreateCouponModal.style.display = 'none';

			$scope.couponCreate = {};
			$scope.couponCreate.couponId=$scope.coupon.couponId
			$scope.couponCreate.couponTitle=$scope.coupon.couponTitle
			$scope.couponCreate.companyId=$scope.coupon.companyId
			$scope.couponCreate.startDate = $filter('date')($scope.coupon.startDate, "dd-MM-yyyy");
			$scope.couponCreate.endDate = $filter('date')($scope.coupon.endDate, "dd-MM-yyyy");
			$scope.couponCreate.couponAmount=$scope.coupon.couponAmount
			$scope.couponCreate.couponType=$scope.coupon.couponType
			$scope.couponCreate.message=$scope.coupon.message
			$scope.couponCreate.price=$scope.coupon.price
			$scope.couponCreate.image=$scope.coupon.image
			console.log($scope.couponCreate);

			$http.post("/CouponProject/rest/company/createCouponByCompanyId",$scope.couponCreate).success(function(data){
				alert('Coupon was Successfully created!');
				$http.get("/CouponProject/rest/company/getCouponsByCompany").success(function(data){
					$scope.coupons = data.coupon;
					if ($scope.coupons.length == undefined){
						var arr = [];
						arr.push($scope.coupons);
						$scope.coupons = arr;
					}

				})

			})
			.error(function(data,status) {

				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		};


		this.deleteCouponAndDeleteCouponsPurchasedByCustomer = function (couponId) {

			var result=confirm("Are you sure you want to delete this coupon?");
			if(result==true){
				function getSelectedIndex(couponId){
					for(var i=0;i<$scope.coupons.length;i++)
						if($scope.coupons[i].couponId==couponId)
							return i;
					return -1;
				}

				$http({
					method: 'DELETE', 
					url: "/CouponProject/rest/company/deleteCouponAndDeleteCouponsPurchasedByCustomer/"+couponId,


				})

				.success(function(data){
					alert('Coupon was Successfully removed, All Coupons purchased by customers are now also removed!');
					console.log(couponId);
					$http.get("/CouponProject/rest/company/getCouponsByCompany").success(function(data){
						$scope.coupons = data.coupon;
						if ($scope.coupons.length == undefined){
							var arr = [];
							arr.push($scope.coupons);
							$scope.coupons = arr;
						}
					})
				})
				.error(function(data,status) {

					alert(data.message);
					if(status==401){
						alert("Your Session Expired");
						$window.location.assign('/CouponProject/#');

					} 
				})

			}
		};

		this.updateCoupon = function (couponId){
//			function to close modal after the update form function 
			UpdateCouponModal.style.display = 'none';

			$scope.couponUpdate = {};
			$scope.couponUpdate.couponId=$scope.couponId
			$scope.couponUpdate.couponTitle=$scope.couponTitle
			$scope.couponUpdate.companyId=$scope.companyId
			$scope.couponUpdate.startDate=$filter('date')($scope.startDate, "dd-MM-yyyy");
			$scope.couponUpdate.endDate=$filter('date')($scope.endDate, "dd-MM-yyyy");
			$scope.couponUpdate.couponAmount=$scope.couponAmount
			$scope.couponUpdate.couponType=$scope.couponType
			$scope.couponUpdate.message=$scope.message
			$scope.couponUpdate.price=$scope.price
			$scope.couponUpdate.image=$scope.image
			console.log($scope.couponUpdate);

			$http.put("/CouponProject/rest/company/updateCouponByCompanyId",$scope.couponUpdate).success(function(data){
				alert("Coupon was Successfully updated");

				$http.get("/CouponProject/rest/company/getCouponsByCompany").success(function(data){
					$scope.coupons = data.coupon;
					if ($scope.coupons.length == undefined){
						var arr = [];
						arr.push($scope.coupons);
						$scope.coupons = arr;
					}

				})

			})
			.error(function(data,status) {

				alert(data.message);
				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})

		}

		this.getCouponsByCompanyIdAndCouponType = function (){
			$http.get("/CouponProject/rest/company/getCouponsByCompanyAndCouponType/?CouponType="+$scope.CouponType).success(function(data){
				$scope.coupons= data.coupon;

				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCompanyIdAndStartDateStartAndEndDateLimit = function (){
			$scope.formattStartDateStart = $filter('date')($scope.startDateStart, "dd-MM-yyyy");
			$scope.formattStartDateLimit = $filter('date')($scope.startDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/company/getCouponsByCompanyIdAndStartDateStartAndEndDateLimit/?startDateStart="+$scope.formattStartDateStart+"&startDateLimit="+$scope.formattStartDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.startDateStart);
				console.log($scope.formattStartDateStart);
				console.log($scope.formattStartDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}		
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCompanyIdAndEndDateStartAndEndDateLimit = function (){
			$scope.formatteEndDateStart = $filter('date')($scope.endDateStart, "dd-MM-yyyy");
			$scope.formatteEndDateLimit = $filter('date')($scope.endDateLimit, "dd-MM-yyyy");

			$http.get("/CouponProject/rest/company/getCouponsByCompanyIdAndEndDateStartAndEndDateLimit/?endDateStart="+$scope.formatteEndDateStart+"&endDateLimit="+$scope.formatteEndDateLimit).success(function(data){
				$scope.coupons= data.coupon;
				console.log($scope.formatteEndDateStart);
				console.log($scope.formatteEndDateLimit);
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}
		this.getCouponsByCompanyIdAndStartPriceAndLimitPrice = function (){
			$http.get("/CouponProject/rest/company/getCouponsByCompanyIdAndStartPriceAndLimitPrice/?startPrice="+$scope.startPrice+"&limitPrice="+$scope.limitPrice).success(function(data){
				$scope.coupons = data.coupon;


				function setTwoNumberDecimal(event) {
					this.value = parseFloat(this.value).toFixed(2);
				}
				if ($scope.coupons.length == undefined){
					var arr = [];
					arr.push($scope.coupons);
					$scope.coupons= arr;
				}
			})
			.error(function(data,status) {

				if(status==401){
					alert("Your Session Expired");
					$window.location.assign('/CouponProject/#');

				} 
			})
		}





	}])


})();
