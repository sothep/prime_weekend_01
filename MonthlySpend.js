//Theta Weekend Challenge 01
//By Paul Sotherland, 13-Dec 15

//Global variables
var employees = [];
var monthlyCost = 0;

$(document).ready(function() {
	$('#employeeData').on('submit', function(event){
		var replaceEmployee = false;
		event.preventDefault();
		var $data = $('#employeeData').serializeArray();
		
		for (var i = 0; i < 5; i++) {
			if ($data[i].value.toString().length <= 0){
				alert('Fields cannot be left blank.  Please try again.');
				return;
			}
		}

		var newEmployee = new Employee($data[0].value, $data[1].value, $data[2].value, $data[3].value, $data[4].value);

		//employee IDs are unique; the user may choose to update existing data in place
		if (employeeExists(newEmployee.id)) {
			if (confirm('An employee with ID: ' + newEmployee.id + ' already exists.  Would you like to update their record?')){
				replaceEmployee = true;
			}
			else return;
		}

		if (!replaceEmployee){ //add new employee (new case)
			employees.push(newEmployee);
		}
		else { //remove old salary data and replace employee (update case)
			monthlyCost -= parseInt(employees[employeeIndex(newEmployee.id)].salary) / 12;
			employees[employeeIndex(newEmployee.id)] = newEmployee;
		}

		monthlyCost += parseInt(newEmployee.salary) / 12; //happens for both cases

		updateEmployees();
		updateCost();
		$('input[type=text], input[type=number]').val('');
	});
	

	/*Each listed employee has his/her own delete button.  Deletion occurs
	simply by updating the global employees array and cost total.  Then,
	the DOM is cleared and rebuilt to match.*/
	$('body').on('click', '.delButton', function(event){
		var index = $(this).attr('id');
		event.preventDefault();
		monthlyCost -= parseInt(employees[index].salary) / 12;
		employees.splice(index, 1); //remove employee from the array
		updateEmployees();
		updateCost();
	});
});

//the toString() method here provides the desired output for the DOM
function Employee(firstName, lastName, id, title, annualSalary){
	this.firstName = firstName;
	this.lastName = lastName;
	this.id = id;
	this.title = title;
	this.salary = annualSalary;
	this.toString = function() {
		return 'Employee #' + this.id + ': ' + this.firstName + ' ' + this.lastName + ', ' + this.title + ': $' + parseInt(this.salary) + '/yr';
	};
}

function clearEmployees(){
	$('#employeeList').children().remove();
}

//Rebuilds the employee list in the DOM, including individual delete buttons
function updateEmployees(){
	var $el = $('#employeeList');
	clearEmployees();
	for (var i = 0; i < employees.length; i++) {
		$el.append('<div class="del-row"></div>');
		$el.children().last().append('<button class="delete delButton" id="' + i + '">(delete)</button>');
		$el.children().last().append('<p class="delete">' + employees[i].toString() + '</p>');
	}
}

function employeeIndex(id){
	for (var i = 0; i < employees.length; i++){
		if (employees[i].id == id) return i;
	}
	return -1;
}

function employeeExists(id){
	for (var i = 0; i < employees.length; i++){
		if (employees[i].id == id) return true;
	}
	return false;
}

//Updates DOM display for monthly cost
function updateCost(){
	$('#monthlyCost').text('Total Monthly Cost: $' + parseInt(monthlyCost));
}