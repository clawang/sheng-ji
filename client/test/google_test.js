const webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until,
    Keys = webdriver.Key;

// const drivers = [];

// for(let i = 0; i < 4; i++) {
//   let dr = new webdriver.Builder()
//       .forBrowser('chrome')
//       .build();
//   drivers.push(dr);
// }

const driver = new webdriver.Builder()
      .forBrowser('chrome')
      .build();

//driver.manage().timeouts().implicitlyWait(10);
driver.manage().setTimeouts( { implicit: 10000 } );

const usernames = ['claire', 'nina', 'jason', 'rachel'];
const teams = ['declarers', 'opponents'];

driver.get('http://localhost:3000/');
player(driver, 0);

function player(driver, n) {
  if(n < 4) {
    driver.getWindowHandle().then(handle => console.log(handle));

    var username = driver.wait(until.elementLocated(By.id('username')));
    username.sendKeys(usernames[n]);
    username.sendKeys(webdriver.Key.ENTER);

    var join = driver.wait(until.elementLocated(By.id('join-player')));
    join.click();

    let str = teams[n % 2];
    var team = driver.wait(until.elementLocated(By.id(str)));
    team.click();

    var start = driver.wait(until.elementLocated(By.id('start-game')));
    start.click().then(function() {
      if(n < 3) {
          driver.executeScript('window.open("/");');
          driver.sleep(2000).then(function() {
            driver.getAllWindowHandles().then(function(allhandles) {
              //console.log(allhandles);
              driver.switchTo().window(allhandles[n + 1]);
              player(driver, n + 1);
              //return driver.switchTo().window(allhandles[allhandles.length - 1]);
            });
          });
        }
    });
  } else {
    return;
  }
}
