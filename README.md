# inventory_application_nodejs
A CRUD based project where you manage movie inventory. This project is built using Node.js, Express.js, MongoDB. 


Live demo on <a href="https://inventory-application-nodejs.adaptable.app/catalog"> Adaptable.io</a>, <a href="https://inventory-application-nodejs.onrender.com"> render.com</a>

## Deployment Notes

If you want to view the project on render.com it is  important to note that as I am using free tier,  according to https://docs.render.com/free, render spins down a Free web service that goes 15 minutes without receiving inbound traffic. Render spins the service back up whenever it next receives a request to process. Spinning up a service takes a few seconds, which causes a noticeable delay for incoming requests until the service is back up and running. For example, a browser page load will hang momentarily. 