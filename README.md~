# payumoney_integration
Pay u money integration in Node JS

### Usage
1. The usage is pretty simple, first download / clone the project into your server or local directory.
2. Add environment variables **PAYU_KEY**, **PAYU_SALT** to your server environment / local environment and set **TESTING** environment variable to **false**(In case of linux setting environment variables can be done using the 'export').<br />
**Note**: In case you want to work on **test server** ignore the above step 
3. Run the folowing commands in your bash terminal(I am not sure about CMD, sorry!, cz I am not a windows user.).

```bash
    npm install
    node payment.js
```

### Once done prequisite installation:
4. Once the server starts up all you have to do is to pull up a html file(an example HTML file is present in the root folder of this repo). All that html file has to do is to send a POST request with a parameter 'amount'. 
5. That's it you will redirected to a form that gets some really important info(Mandatory data) and that's it it redirects you straight to the payment.

### Be aware of
1. Variable names written wrong.
2. Wrong KEY and SALT, you need to get the merchant KEY and SALT form payupeople. It's not that hard, just visit their website.

### To use this repo for production purposes:
1. Make sure you follow the usage section above and emphasize on the second point.
2. Remove `<%= JSON.stringify(data) %>` line in /views/success.ejs and /views/failure.ejs .
