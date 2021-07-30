# Schemas

## Conventions

    1. Italic contents are optional
___  

### **Property Schema**

```JSON5
    {
        title: "string",                                                                // title of property (max 50 characters) 
        description: "string",                                                          // description of property (max 500 characters)
        isFeatured: "boolean",                                                          // property featured or not
        isApproved: "boolean",                                                          // property approved by the authority or not                                    
        location: {
            coordinates: {
                lng: "double",
                lat: "double"
            },                                                                          // coordinates to plot a pin on the map
            country: "string",                                                          // country the property is located in
            city: "string",                                                             // city the property is located in
            area: "string",                                                             // area the property is located in
            zipCode: "string",                                                          // zip code of specific address
            aptSuite: "string",                                                         // standardized apartment/suite access code
            streetAddress: "string"                                                     // street address of property
        },                                                                              // location details
        ownerID: "ObjectId",                                                            // unique ID of owner
        ownerLanguage: ["string"],                                                      // languages owner knows
        typeOfProperty: "string",                                                       // property type mapped to file on server
        timesRented: "int",                                                             // number of times property was rented out before
        guestAccess: "string",                                                          // access to entire property or a part
        accommodationCapacity: {
            adults: "int",
            children: "int",
            infants: "int"
        },                                                                              // number of guests that can be accommodated
        accommodationServices: {
            bedroom: {
                count: "int",
                bedCount: "int"
            },                                                                          // bedroom details
            bathroom: {
                count: "int",
                isPrivate: "boolean"
            },                                                                          // bathroom details
            amenities: ["string"],                                                      // amenities mapped to file on server
            guestAccessibleSpaces: ["string"]                                           // accessible spaces mapped to file on server
        },                                                                              // details of various services offered
        rating: {
            value: "double",
            timesRated: "int"
        },                                                                              // average of ratings of all reviews of the property
        price: {
            basePrice: "double",
            discountPercentage: "double",
            discountDuration: "int",
            discountExpiration: "Date",
        },                                                                              // pricing with discount details
        stayTimeInNights: {
            min: "int",
            max: "int"
        },                                                                              // minimum and maximum allowed stay at property
        arrivalNoticeInDays: "int",                                                     // days between notifying the host and arriving on property
        checkInTime: {
            from: "string",
            to: "string"
        },                                                                              // check-in time range
        rulesForGuests: ["string"],                                                     // rules mapped to a file on server
        detailsForGuests: ["string"],                                                   // additional details for guests mapped to a file on server
        guestRequirements: {
            mandatory: ["string"],
            beforeBooking: ["string"],
            additional: ["string"]
        },                                                                              // requirements for guests mapped to a file on server
        imagesOfProperty: ["url"],                                                      // images for this property (max 10)
    }
```  

### **User Schema**

```JSON5
    {
        username: "string",                                                             // unique username for each user
        userEmail: "string",                                                            // unique userEmail for each user
        password: "string",                                                             // encrypted password
        lastupdated: "Date",                                                            // password last updated
        userType: "string",                                                             // user type to ensure priority              
        tokens: [{
            access: "string",
            token: "string"
        }],                                                                             // tokens to manage sessions
        resetToken: "string"                                                            // token to reset password
    }
```

### **UserDetail Schema**

```JSON5
    {
        username: "string",                                                             // unique username for user
        verified: "boolean",                                                            // government verification
        image: "url",                                                                   // user's profile image
        name: {
            firstName: "string",
            lastName: "string"
        },                                                                              // user's name
        gender: "string",                                                               // user's gender
        birthDate: "Date",                                                              // user's date of birth
        contacts: {
            email: "string",                                                            // user's email address same as the one in user schema
            phone: "string",                                                            // standardized E.164 phone number
            address: {
                country: "string",
                city: "string",
                area: "string",
                zipCode: "string",
                streetAddress: "string",
            },                                                                          // user's address
            emergencyContact: {
                name: "string", 
                email: "string",
                relationship: "string",                                                 // relationship with user
                phone: "string"                                                         // standardized E.164 phone number
            }                                                                           // emergency contact details
        },                                                                              // all contact details
        notification: [{
            message: "string",
            time: "Date",
            unread: "boolean"
        }],                                                                             // notifications
        govtID: "string",                                                               // unique ID provided by the government
        properties: ["ObjectId"],                                                       // list of properties owned (ObjectId only)
        blockServices: {
            status: "boolean",
            until: "Date"
        },                                                                              // temporarily make user unavailable as host
        favorites: ["ObjectId"],                                                        // list of user's favorite properties (ObjectId only)
        userLanguage: ["string"],                                                       // languages user knows
        paymentOptions: {
            directDeposit: {
                accountNumber: "string"
            }, 
            creditCard: {
                cardHolderName: "string",
                cardNumber: "string"
            }
        }                                                                               // user's payment info (encrypted)
    }
```  

### **Reservation Schema**

```JSON5
    {
        guestID: "ObjectId",                                                            // uniquely identifies guest user
        propertyID: "ObjectId",                                                         // uniquely identifies property
        checkIn: "Date",                                                                // check in date
        checkOut: "Date",                                                               // check out date
        reservationDate: "Date",                                                        // date on which reservation was made
        status: "string",                                                               // pending or confirmed
        conversation: [{
            message: "string",
            time: "Date",
        }]                                                                              // message thread for a particular reservation
    }
```  

### **Review Schema**

```JSON5
    {
        userID: "ObjectId",                                                             // uniquely identifies user
        propertyID: "ObjectId",                                                         // uniquely identifies property
        date: "Date",                                                                   // date of review
        comment: "string",                                                              // comment from the user
        rating: "int",                                                                  // rating from the user
    }
```

### **Message Schema**

```JSON5
    {
        senderID: "ObjectId",                                                           // uniquely identifies sender user
        receiverID: "ObjectId",                                                         // uniquely identifies receiver user
        propertyID: "ObjectId",                                                         // uniquely identifies property
        timestamp: "Date",                                                              // time of message sent/received
        messageDetails: "string",                                                       // body of message
        hasRead: "boolean",                                                             // receiver has read or not
        hasSenderStarred: "boolean",                                                    // sender has starred or not
        hasReceiverStarred: "boolean",                                                  // receiver has starred or not
        deletedBySender: "boolean",                                                     // sender has deleted or not
        deletedByReceiver: "boolean",                                                   // receiver has deleted or not
    }
```

### **TrendDest Schema**

```JSON5
    {
        name: "string",                                                                 // name of the place
        image: "string",                                                                // image of the place
        type: "string",                                                                 // type of place
    }
```


