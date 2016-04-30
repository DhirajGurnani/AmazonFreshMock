exports.getTripId = function(driverId,truckId,location,adminId,comment){
	var timestamp = new Date().getTime();
	return "insert into Trips(driver_id,truck_id,truck_location,admin_id,comments) values (" +
			  driverId +","
			+ truckId +",'"
			+ location+"','"
			+ adminId+"','"
			+ comment+"');"			
};

exports.updateTripInfoQuery = function(tripId,billId){
	return "insert into TripInfo (trip_id,billing_id) values ("+
	tripId+","+
	billId+");"
};
exports.getBillId = function(tripId){
	return "select billing_id from TripInfo where trip_id = "+tripId+";";
};

exports.sqllocationStats = function(tripId){
	return "select location as Location, count(location) as Count from amazondb.Billing group by location";
};

exports.sqlGetBills = function(){
	return "SELECT * FROM amazondb.Billing order by billing_id desc;"
};

exports.sqlValidEmail = function(email){
	return "SELECT * FROM Users where email ='"+email+"';";
};

exports.sqlRevenueStats = function(){
	return "select date(created_at) as label, sum(total_price) as y from amazondb.Billing group by date(created_at)"
};

exports.updateTruck=function(truckId){
	return "update Trucks set status ='in_delivery' where truck_id = "+truckId+";"
};
exports.updateTruckAvailable=function(truckId){
	return "update Trucks set status ='available' where truck_id = "+truckId+";"
};
exports.updateDriver=function(driverId){
	return "update Drivers set status = 'in_delivery' where driver_id ="+driverId+";"
};
exports.updateDriverAvailable=function(driverId){
	return "update Drivers set status = 'available' where driver_id ="+driverId+";"
};



exports.updateBillingQuery = function(driverId,billId){
	return "update Billing set status = 'transit',driver_id="+
	driverId+" where billing_id ="+
	billId+";"
};

exports.billUpdateQuery = function(billId){
	return "update Billing set status = 'placed' where billing_id ="+
	billId+";"
};



exports.getTripQuery = function(tripId){
	return "Select * from Trips where trip_id ="+tripId+";"
};

exports.deleteTrips=function(tripId){
	return "delete from Trips where trip_id ="+tripId+";"
};

exports.deleteTripInfo=function(tripId){
	return "delete from TripInfo where trip_id ="+tripId+";"
};

exports.getAllTrips=function(){
	return "select * from Trips;"
};

exports.sqlGetBills=function(){
	return "select * from Billing where status = 'placed';"
};

exports.getAllPendingTrips=function(){
	return "select * from Trips LEFT JOIN Drivers on Drivers.driver_id=Trips.driver_id where Drivers.status = 'in_delivery';"
};
exports.sqlQueryRegister=function(puid,first_name,last_name,birthday,address,location,state,zipcode,phone,role,status){
	
	return "insert into User_profiles (puid,status,last_name,birthday,address,location,state,zipcode,phone,role,first_name) VALUES ('" +
			+puid+"','"
			+status+"','"
			+last_name+"','"
			+birthday+"','"
			+address+"','"
			+location+"','"
			+state+"','"
			+zipcode+"','"
			+phone+"','"
			+role+"','"
			+first_name+"');"	
};
exports.sqlUserRegister=function(email,password){
	return "insert into Users (email,password) values ('"+email+"','"+password+"');"
};

exports.sqlAvailableTruck = function(){
	return "select * from Trucks where status = 'available' ;"
};

exports.sqlAvailableDriver = function(){
	return "select * from Drivers where status ='available' ;"
};

exports.getSampleQuery = function() {
	return "select * from employee";
};
exports.loginCheck = function(username){
	console.log(username);
	return "select * from Users where email='"+username+"';";
};
exports.getProfile = function(puid){
	return "select * from User_profiles where puid = '"+puid+"';";
}

/**
 *  Query for getting password for a given email
 */
exports.getPasswordForEmailQuery = function(email) {
	return "select * from Users where email = '" + email + "'";
};

/**
 *  Query for getting user profile for a given puid
 */
exports.getQueryForUserProfileByPuid = function(puid) {
	return "select * from User_profiles where puid = '" + puid + "'";
};

/**
 *  Query for getting follower count for a given puid
 */
exports.getFollowerCountByPuid = function(puid) {
	return "select count(*) as count from Followers where followerid = '"
			+ puid + "'";
};

exports.getFollowingCountByPuid = function(puid) {
	return "select count(*) as count from Followers where puid = '" + puid
			+ "'";
};

exports.getTweetsCountByPuid = function(puid) {
	return "select count(*) as count from Tweets where puid = '" + puid + "'";
};

exports.getUserPuidByEmailQuery = function(email) {
	return "select puid from Users where email = '" + email + "'";
};

exports.getFollowersByPuidQuery = function(puid) {
	return "select followerid from Followers where puid = '" + puid + "'";
};

exports.getQueryForGetMyTweets = function(puid) {
	return "Select * from Tweets where puid = '" + puid + "' order by created_at DESC";
};

exports.getQueryForFollowerTweets = function(puid) {
	return "select a.* from Tweets a where a.puid in (select followerid from Followers where puid = " + puid + ") order by a.created_at DESC";
};

exports.getQueryForNewUsersByPuid = function(puid, limit) {
	return "select a.puid, b.first_name, b.last_name, b.handle from Users a, User_profiles b where a.puid = b.puid and a.puid not in(select followerid from Followers where puid = "
			+ puid + ") and a.puid!= " + puid + " limit " + limit;
};

exports.getQueryForHashTagByHashtag = function(hashtag) {
	return "select hashid from HashTags where hashtag = '" + hashtag + "'"; 
};

exports.getQueryForHashTagsInfo = function() {
	return "select a.hashid, a.hashtag, count(b.tweetid) as count from HashTags a, HashTagTweets b where a.hashid = b.hashid group by a.hashid order by count DESC limit 9";
};

exports.getQueryForHashTagTweets = function(hashid) {
	return "select a.* from Tweets a, HashTagTweets b where a.tweetid = b.tweetid and b.hashid = '" + hashid + "'";
};

exports.getQueryForHashTagMessage = function(hashid) {
	return "select hashtag from HashTags where hashid = '" + hashid + "'";
};

exports.getQueryForHashTagId = function(hashtag) {
	return "select hashid from HashTags where hashtag like '#" + hashtag + "'";
};

exports.getQueryforProfileIdbyName = function(name) {
	return "select puid from User_profiles where first_name like '%" + name + "%' or last_name like '%" + name + "%'";
};

exports.getQueryForUserProfileCreation = function(puid, handle, first_name,
		last_name, phone, city, birthday) {
	return "Insert into User_profiles (puid,handle,first_name,last_name,phone,city,birthday) values "
			+ "('"
			+ puid
			+ "','"
			+ handle
			+ "','"
			+ first_name
			+ "','"
			+ last_name
			+ "','"
			+ phone
			+ "','"
			+ city
			+ "','"
			+ birthday
			+ "')";
};

exports.getQueryForUserCreation = function(email, password) {
	return "Insert into Users (email,password) values ('" + email + "','"
			+ password + "')";
};

exports.getQueryForTweetCreation = function(puid, tweet, handle, first_name,
		last_name) {
	return "Insert into Tweets (puid, tweet, handle, first_name, last_name) values ('"
			+ puid
			+ "','"
			+ tweet
			+ "','"
			+ handle
			+ "','"
			+ first_name
			+ "','" 
			+ last_name + "')";
};

exports.getQueryForUserFollowerCreation = function(puid, followerid) {
	return "Insert into Followers (puid, followerid) values ('" + puid + "','" + followerid + "')";
};

exports.getQueryForHashTagEntryCreation = function(hashtag) {
	return "Insert into HashTags (hashtag) values('" + hashtag + "')";
};

exports.getQueryForHashTagTweetsCreation = function(tweetid, hashid) {
	return "Insert into HashTagTweets (tweetid, hashid) values ('" + tweetid + "','" + hashid + "')";
};

exports.getQueryForProductCreation = function(puid, product_name, quantity, price, description, category_id, subcategory_id) 
{
	return "Insert into Products(puid, product_name, quantity, price, description, category_id, subcategory_id, status) values('" + puid+  "','"  +  product_name+  "','"  +  quantity+  "','"  +  price+  "','"  +  description+  "','"  +  category_id+  "','"  +  subcategory_id + "', 'pending')";
};
exports.getQueryForUpdateProductDetails = function(product_id, product_name, quantity, price, description, category_id, subcategory_id) {
	return "UPDATE Products set product_name = '" + product_name + "', quantity = '" + quantity + "', price = '" + price + "', description = '" + description + "', category_id = '" + category_id + "', subcategory_id = '" + subcategory_id + "'  where product_id = '" + product_id + "'";
};

exports.getQueryForAllProducts = function() {
return "select * from Products";
};

exports.getQueryForProductByProductId = function(product_id) {
return "select * from Products where product_id = '" + product_id + "'";
};

exports.getProductRatingsByProductId = function(product_id) {
return "select * from Ratings where product_id = '" + product_id + "'";
};

exports.getQueryForDeleteOfAProductByProductId = function(product_id) {
	return "delete from Products where product_id = '" + product_id + "'";
};

exports.productreviews = function(product_id) {
	return "select reviews from Products pro inner join Ratings rat  on pro.product_id = rat.product_id where pro.product_id = '" + product_id + "'";
};

exports.getQueryForProductsByCategoryId = function(category_id) {
	return "select * from Products where category_id = '" + category_id + "'";
};

exports.getQueryForProductBySubcategoryId = function(subcategory_id) {
	return "select * from Products where subcategory_id = '" + subcategory_id + "'";
};

exports.getQueryForProductsByCategoryAndSubCategoryId = function(category_id, subcategory_id) {
	return "select * from Products where category_id = '" + category_id + "' and subcategory_id = '" + subcategory_id + "'";
};

exports.deletecustomer = function(puid) {
	return "delete from User_profiles where puid = '" + puid + "'";
};

exports.updatecustomer = function(firstname,lastname,birthday,address,location,state,zipcode,phone,puid) {
	return "UPDATE User_profiles set first_name = '" + firstname + "' , last_name = '" + lastname + "', birthday = '" + birthday + "' , address = '" + address + "' , location = '" + location + "' , state = '" + state + "' , zipcode = '" + zipcode + "' , phone = '" + phone + "'  where puid = '" + puid + "'";
};

exports.approvefarmer = function(puid) {
return "UPDATE User_profiles set status = 'active' where role = 'farmer' and puid = '" + puid + "'";
};

exports.approveproduct = function(product_id) {
return "UPDATE Products set status = 'approved' where  product_id = '" + product_id + "'";
};

exports.getQueryForBillingCreation = function(customer_id, address, location, state, zipcode, phone, total_price, delivery_date, delivery_id, status) {
	return "insert into Billing(customer_id, address, location, state, zipcode, phone, total_price, delivery_date, delivery_id, status) " +
			"values('" + customer_id+  "','"  + address+  "','"  + location+  "','"  + state+  "','"  + zipcode+  "','"  + phone+  "','"  + total_price+  "','"  + delivery_date+  "','"  + delivery_id+  "','"  + status + "')";
};

exports.getQueryForBillingInfoCreation = function(billing_id, product_id, quantity) {
	return "insert into BillingInfo(billing_id, product_id, quantity) " +
			"values(" + billing_id + "," + product_id + "," + quantity + ")";
};

exports.getFarmerProfileByProductId = function(product_id) {
	return "select * from User_profiles where puid = (select puid from products where product_id = " + product_id + ")";
};
exports.sqlgetFarmersPending = function(product_id) {
	return "select * from amazondb.User_profiles where role = 'farmer' and status = 'pending';";
};

exports.getQueryForUpdateBillingWithCurrentLocation = function(billing_id, current_location){
	return "update Billing set current_location = '" + current_location + "' where billing_id = " + billing_id + "";
};

exports.getProductCategories = function() {
	return "select * from ProductCategory";
};

exports.sqlgetProductsPending = function() {
	return "SELECT * FROM amazondb.Products where status = 'pending'";
};

exports.getProductSubCategoriesByCategoryId = function(category_id) {
	return "select * from ProductSubCategory where category_id = '" + category_id + "'";

exports.getQueryForUpdateBillingWithCurrentLocation = function(billing_id, current_location){
	return "update Billing set current_location = '" + current_location + "' where billing_id = " + billing_id + "";
};