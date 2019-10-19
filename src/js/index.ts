import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface ICar {
    id: number;
    model: string;
    vendor: string;
    price: number;
}

let baseUri: string = "https://anbo-carsrestv3.azurewebsites.net/api/cars"
// "http://anbo-carsrest.azurewebsites.net/api/cars";

let getAllButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getAllButton");
getAllButton.addEventListener("click", showAllCars);

let getByIdButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getByIdButton");
getByIdButton.addEventListener("click", getById);

let deleteButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteButton");
deleteButton.addEventListener("click", deleteCar);

let getByVendorButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getByVendorButton");
getByVendorButton.addEventListener("click", getByVendor);

let getByModelButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getByModelButton");
getByModelButton.addEventListener("click", getByModel);

let getByPriceRangeButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("getByPriceRangeButton");
getByPriceRangeButton.addEventListener("click", getByPriceRange);

let addButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("addButton");
addButton.addEventListener("click", addCar);

let updateButton: HTMLButtonElement = <HTMLButtonElement>document.getElementById("updateButton");
updateButton.addEventListener("click", updateCar);

function carToString(car: ICar): string {
    return car.id + " " + car.model + " " + car.vendor + " " + car.price;
}

function carArrayToList(cars: ICar[]): string {
    if (cars.length == 0) {
        return "empty";
    }
    let result: string = "<ul class='list-group'>";
    cars.forEach((car: ICar) => {
        result += "<li class='list-group-item'>" + carToString(car) + "</li>";
    });
    result += "</ul>";
    return result;
}

function carsArrayToTable(cars: ICar[]): string {
    let result: string = "<table class='table table-striped'>" 
    result += "<thead><th>id</th><th>vendor</th><th>model</th><th>price</th></thead>";
    // https://www.w3schools.com/bootstrap/bootstrap_tables.asp
    cars.forEach((car: ICar) => {
        result += "<tr><td>" + car.id + "</td><td>" + car.vendor + "</td><td>" + car.model + "</td><td>" + car.price + "</tr></td>";
    });
    result += "</table>"
    return result;
}

function showAllCars(): void {
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("content");
    axios.get<ICar[]>(baseUri)
        .then(function (response: AxiosResponse<ICar[]>): void {
            // element.innerHTML = generateSuccessHTMLOutput(response);
            // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
            // outputHtmlElement.innerHTML = JSON.stringify(response.data);
            outputElement.innerHTML = carArrayToList(response.data);
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                outputElement.innerHTML = error.message;
            } else { // something went wrong in the .then block?
                outputElement.innerHTML = error.message;
            }
        });
}

function getById(): void {
    console.log("getById");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteInput");
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDeleteOrGetById");
    let id: string = inputElement.value;
    let uri: string = baseUri + "/" + id;
    axios.get<ICar>(uri)
        .then((response: AxiosResponse) => {
            if (response.status == 200) {
                outputElement.innerHTML = response.status + " " + carToString(response.data);
            } else {
                outputElement.innerHTML = "No such car, id: " + id;
            }
        })
        .catch((error: AxiosError) => {
            outputElement.innerHTML = error.code + " " + error.message
        })
}

function getByVendor(): void {
    console.log("getByVendor")
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("vendorInput");
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("contentGetByFunctions");
    let vendor: string = inputElement.value;
    let uri: string = baseUri + "/vendor/" + vendor;
    axios.get<ICar[]>(uri)
        .then((response: AxiosResponse) => {
            if (response.status == 200) {
                outputElement.innerHTML = response.status + " " + carArrayToList(response.data);
            } else {
                outputElement.innerHTML = "No such car, vendor: " + vendor;
            }
        })
        .catch((error: AxiosError) => {
            outputElement.innerHTML = "Error " + error.code + " " + error.message
        })
}

function getByModel(): void {
    console.log("getByModel")
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("modelInput");
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("contentGetByFunctions");
    let model: string = inputElement.value;
    let uri: string = baseUri + "/model/" + model;
    axios.get<ICar[]>(uri)
        .then((response: AxiosResponse) => {
            if (response.status == 200) {
                outputElement.innerHTML = response.status + " " + carArrayToList(response.data);
            } else {
                outputElement.innerHTML = "No such car, model: " + model;
            }
        })
        .catch((error: AxiosError) => {
            outputElement.innerHTML = "Error " + error.code + " " + error.message
        })
}

function getByPriceRange(): void {
    let inputElement1: HTMLInputElement = <HTMLInputElement>document.getElementById("lowerPriceInput")
    let inputElement2: HTMLInputElement = <HTMLInputElement>document.getElementById("higherPriceInput")
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("contentGetByFunctions");
    let fromPrice: string = inputElement1.value;
    let toPrice: string = inputElement2.value;
    // TODO check fromPrice <= toPrice
    let uri: string = baseUri + "/price/" + fromPrice + "/" + toPrice;
    axios.get<ICar[]>(uri)
        .then((response: AxiosResponse) => {
            if (response.status == 200) {
                outputElement.innerHTML = carsArrayToTable(response.data);
                console.log(carsArrayToTable(response.data))
            } else {
                outputElement.innerHTML = "No such car";
            }
        })
        .catch((error: AxiosError) => {
            outputElement.innerHTML = "Error " + error.code + " " + error.message
        })
}

function deleteCar(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDeleteOrGetById");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteInput");
    let id: string = inputElement.value;
    let uri: string = baseUri + "/" + id;
    axios.delete(uri)
        .then(function (response: AxiosResponse): void {
            // element.innerHTML = generateSuccessHTMLOutput(response);
            // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
            console.log(JSON.stringify(response));
            output.innerHTML = response.status + " " + response.statusText;
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response.status == 404) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                output.innerHTML = "No such car, id: " + id
            } else { // something went wrong in the .then block?
                output.innerHTML = "Error: " + error.code + " " + error.message
            }
        });
}

function addCar(): void {
    let addModelElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addModel");
    let addVendorElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addVendor");
    let addPriceElement: HTMLInputElement = <HTMLInputElement>document.getElementById("addPrice");
    let myModel: string = addModelElement.value;
    let myVendor: string = addVendorElement.value;
    let myPrice: number = Number(addPriceElement.value);
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentAdd");
    // id is generated by the back-end (REST service)
    axios.post<ICar>(baseUri, { model: myModel, vendor: myVendor, price: myPrice })
        .then((response: AxiosResponse) => {
            let message: string = "response " + response.status + " " + response.statusText;
            output.innerHTML = message;
            console.log(message);
        })
        .catch((error: AxiosError) => {
            output.innerHTML = "Error " + error.code + " " + error.message
            console.log(error);
        });
}

function updateCar(): void {
    let updateIdElmenent: HTMLInputElement = <HTMLInputElement>document.getElementById("updateId");
    let updateModelElement: HTMLInputElement = <HTMLInputElement>document.getElementById("updateModel");
    let updateVendorElement: HTMLInputElement = <HTMLInputElement>document.getElementById("updateVendor");
    let updatePriceElement: HTMLInputElement = <HTMLInputElement>document.getElementById("updatePrice");
    let id: string = updateIdElmenent.value;
    let myModel: string = updateModelElement.value;
    let myVendor: string = updateVendorElement.value;
    let myPrice: number = Number(updatePriceElement.value);
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentUpdate");
    let uri: string = baseUri + "/" + id;
    axios.put<ICar>(uri, { model: myModel, vendor: myVendor, price: myPrice })
        .then((response: AxiosResponse) => {
            let message: string = "response " + response.status + " " + response.statusText;
            console.log(message);
            if (response.status == 200)
                output.innerHTML = carToString(response.data);
            else
                output.innerHTML = "No such car, id: " + id;
        })
        .catch((error: AxiosError) => {
            output.innerHTML = "Error " + error.code + " " + error.message
            console.log(error);
        });

}