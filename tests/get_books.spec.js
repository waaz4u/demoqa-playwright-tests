
import {test, expect} from '@playwright/test';
import { json } from 'stream/consumers';

test('test01', async ({ request }) => {
    const USERNAME = "test_username05";
    const PASSWORD = "Password01*";
    // 1. Get token for the user.
    const getToken = await request.post("https://demoqa.com/Account/v1/GenerateToken", {
       data: {
           "userName": USERNAME, 
           "password": PASSWORD,
       }   
    })
    //console.log('\n token = ', await getToken.json())
    let val = await getToken.json();    
    let valtkn = val.token
    console.log('\n -- > Token = ' + valtkn);

    // 2. get userID of the user.
    const getUser = await request.post("https://demoqa.com/Account/v1/Login", {
        'headers': {
            'authorization': 'Bearer ' + valtkn
          },
        data: {
           "userName": USERNAME, 
           "password": PASSWORD,
       }   
    })
    
    // console.log('\n userID = ', await getUser.json())
    let valUserIdJson = await getUser.json();    
    let userId = valUserIdJson.userId
    console.log("\n -- > user id = " + userId);

    const newUrl = "https://demoqa.com/Account/v1/User/" + userId
    console.log('\n userdata url is '+newUrl)
    
    // 3. Get the book in the user profile.
    let getUserData = await request.get( newUrl, {
        'headers': {
            'authorization': 'Bearer ' + valtkn
            //'authorization': 'Bearer ' + tkn
          },
        data: {
           "userName": USERNAME, 
           "password": PASSWORD,
       }   
    })
    // console.log('\n -- > userIdData = ', await getUserData.json())
    let userDataJson = await getUserData.json();    
    let userDatabooks = userDataJson.books
    let Title = userDatabooks[0].title
    console.log('Title of book = ', Title)
})