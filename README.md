# React Assessment Project

I created a React app for viewing and updating products. I organized the code and tried to separate out pieces of the main component so that it is easier to read and understand.
I felt that it was over complicating things for this small app to implement state management with Redux or Context API, so I didn't implement that here.
If I had more time, I would write tests so that a developer could run automated tests to make sure things are working properly.

To setup and run the app, clone it from Github and open the folder in VS Code. Run `npm i` in the cmd line to install all necessary npm dependencies, and then run `npm start` to run the app.

You can reload the page to see how it occasioanly fails (30% of the time) to the load the data and displays a Retry button. The save button also randomly fails due to either network failures or API errors (also 30% of the time).