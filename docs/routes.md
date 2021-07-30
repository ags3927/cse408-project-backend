# **Routes**

## Conventions and Specifications

    - Italic contents are optional
    - Routes that do not explicitly take a unique id parameter are expected to implicitly link data to owner using an authentication token
    - Access levels: 
        > Admin (Authenticated)
        > User (Authenticated)
        > Visitor (Unauthenticated)
     
---


## **Property Routes**

### Base Route - '/property'


### **POST - '/filtered'**

**Request**

```JSON5
    {
        authToken: "string",                                                                     
        filterObject: {
          location: {
            area: "string",
            city: "string"
          },
          typeOfProperty: "string",
          accommodationCapacity: {
            adults: "int",
            children: "int",
            infants: "int"
          },
          accommodationServices: {
            bedroom: {
              beds: "int", 
              bedCount: "int"
            },
            bathroom: {
              count: "int"
            },
            ammenities: ["string"]
          },
          isFeatured: "boolean",
          isApproved: "boolean",
          ownerLanguage: ["string"],
        }
    }
```  

**Response**

```JSON5
    {
        properties: ["Property"]                                                                
    }
```

---

### **GET - '/:id'**

**Request**

```JSON5
    {
        authToken: "string"                                                                  
    }
```

**Response**

```JSON5
    {
        property: "Property"                                                                    
    }
```

---

### **POST - '/insert'**

**Request**

```JSON5
    {
        authToken: "string",                                                                    
        propertyObject: "Property"                                                                  
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```
---

### **POST - '/:id/delete'**

**Request**

```JSON5
    {
        authToken: "string"                                                                    
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                    
    }
```

---

### **PUT - '/:id/update'**

**Request**

```JSON5
    {
        authToken: "string",                                                                    
        propertyUpdate: "Property"                                                                  
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                     
    }
```
---

### **GET - '/:id/reservations'**

**Request**

```JSON5
    {
        authToken: "string"                                                                
    }
```

**Response**

```JSON5
    {
        reservationDates: ["Date"]                                                                      
    }
```
---

### **GET - '/:id/reviews'**

**Request**

```JSON5
    {
                                                                         
    }
```

**Response**

```JSON5
    {
        reviewList: ["Review"]                                                                       
    }
```
---

### **GET - '/featured'**

**Request**

```JSON5
    {
  
    }
```

**Response**

```JSON5
    {
        featuredProperties: ["Property"]                                                                       
    }
```
---

### **GET - '/all'**

**Request**

```JSON5
    {
        authToken: "string",
    }
```

**Response**

```JSON5
    {
        properties: ["Property"]                                                                       
    }
```
---

### **GET - '/sample'**

**Request**

```JSON5
    {
  
    }
```

**Response**

```JSON5
    {
        properties: ["Property"]                                                                       
    }
```
---


## **Review Routes**

### Base route - '/review'

### **POST - '/insert'**

**Request**

```JSON5
    {
        authToken: "string",                                                                     
        reviewObject: "Review"                                                                   
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **POST - '/:id/delete'**

**Request**

```JSON5
    {
        authToken: "string"                                                                 
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **PUT - '/:id/update'**

**Request**

```JSON5
    {
        authToken: "string",                                                                     
        reviewUpdate: "Review"                                                                   
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---


## **Reservation Routes**

### Base route - '/reservation'

### **POST - '/insert'**

**Request**

```JSON5
    {
        authToken: "string",                                                                     
        reserverationObject: "Reservation"                                                       
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                       
    }
```

---

### **POST - '/:id/delete'**

**Request**

```JSON5
    {
        authToken: "string"                                                               
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **POST - '/:id/update'**

**Request**

```JSON5
    {
        authToken: "string",                                                                     
        reservationUpdate: "ReservationUpdate"                                                                   
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---


## **User Routes**

### Base Route - '/user'


### **POST - '/register'**

**Request**

```JSON5
    {
        userObject: "User",
        userDetailObject: "UserDetail"
    }
```  

**Response**

```JSON5
    {
        success: "boolean"                                                              
    }
```

---

### **GET - '/favorites'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        favorites: ["Property"]                                                                    
    }
```

---

### **PUT - '/update'**

**Request**

```JSON5
    {
        authToken: "string",                                                                    
        userDetailUpdate: "UserDetail"                                                                  
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                     
    }
```
---

### **PUT - '/favorites/update'**

**Request**

```JSON5
    {
        authToken: "string",
        action: "string",
        propertyID: "string"                                                                    
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                    
    }
```

---

### **GET - '/reservations/reserved'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        reservationList: ["Reservation"]                                                                      
    }
```
---

### **GET - '/reservations/owned'**

**Request**

```JSON5
    {
        authToken: "string"                                                                 
    }
```

**Response**

```JSON5
    {
        reservationList: ["Reservation"]                                                                      
    }
```
---

### **GET - '/reviews'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        reviewList: ["Review"]                                                                       
    }
```
---

### **GET - '/properties'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        properties: ["Property"]                                                                       
    }
```
---

### **GET - '/details/all'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        userProfile: "UserDetail"                                                                       
    }
```
---

### **GET - '/details/session'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        sessionDetails: "Object"                                                                      
    }
```
---

### **GET - '/details/profile'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        userProfile: "Object"                                                                       
    }
```
---

### **PUT - '/password/update'**

**Request**

```JSON5
    {
        authToken: "string",
        currentPassword: "string",
        newPassword: "string"
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                       
    }
```
---

### **POST - '/password/forgot'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                       
    }
```
---

### **PUT - '/password/reset'**

**Request**

```JSON5
    {
        authToken: "string",
        newPassword: "string",
        confirmNewPassword: "string"
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                       
    }
```
---



## **TrendDest Routes**

### Base route - '/trenddest'

### **POST - '/insert'**

**Request**

```JSON5
    {
        authToken: "string",
        trendDestObject: "TrendDest"                                                                   
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **POST - '/:id/delete'**

**Request**

```JSON5
    {
        authToken: "string"                                                                 
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **PUT - '/:id/update'**

**Request**

```JSON5
    {
        authToken: "string",
        trendDestUpdate: "TrendDest"                                                                   
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---




## **Message Routes**

### Base route - '/message'

### **POST - '/insert'**

**Request**

```JSON5
    {
        authToken: "string",                                                                     
        messageObject: "Message"                                                       
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                       
    }
```

---

### **POST - '/:id/reply'**

**Request**

```JSON5
    {
        authToken: "string",                                                                     
        messageObject: "Message"                                                       
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                       
    }
```

---

### **GET - '/:id'**

**Request**

```JSON5
    {
        authToken: "string""                                                       
    }
```

**Response**

```JSON5
    {
        messageData: "Object"                                                                       
    }
```

---



### **POST - '/:id/delete'**

**Request**

```JSON5
    {
        authToken: "string"                                                                   
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **GET - '/received'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        messageList: ["Message"]                                                                      
    }
```

---

### **GET - '/sent'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        messageList: ["Message"]                                                                      
    }
```

---

### **PUT - '/:id/read/toggle'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **PUT - '/:id/starred/toggle/sender'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---

### **PUT - '/:id/starred/toggle/receiver'**

**Request**

```JSON5
    {
        authToken: "string"
    }
```

**Response**

```JSON5
    {
        success: "boolean"                                                                      
    }
```

---
