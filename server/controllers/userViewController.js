export function homePage(req, res) {
  res.render("home.ejs");
}

export function loginPage(req, res) {
  res.render("login.ejs");
}

export function registerPage(req, res) {
  res.render("register.ejs");
}

export function userPage(req, res) {
  res.render("user.ejs", {
    user: req.user,
  });
}
