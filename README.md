# Mock server for e-commerce project

Base URL for deployed version 
https://e-commerce-backend-example.herokuapp.com/



## GET ITEMS
 /items/itemType=<itemType>

 ## GET COMPANIES
 /companies

  ### For filtering the response according to name
  /items?name=<name_filter>

  ### Sorting
  /items?_sort=<parameter>&_order=<ordering_type>

  ### Pagination

Pagination parameter should be located in the request header as page:0 (default is 0.



##ITEM RESPONSE

    tags: tags with product amounts according to given filter
    companies: companies with product amounts according to given filter
    totalItemAmount:Total product amount for page numbers
    data:  Products to show per page (16 item).
    // These two variables show the total product amount for selection of "All" from filter.
    productsAmountsForCompanies,
    productsAmountsForTags,


