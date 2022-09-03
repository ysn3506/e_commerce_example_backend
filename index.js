const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();
const data = require("./db.json");

server.use(middlewares);

router.render = (req, res) => {
  const tags = () => {
    // Because  tags are not listed seperately on "db.json", Tags are provided from items array and make them uniqe
    const itemsForType = data.items.filter(
      (item) => item.itemType === req.query.itemType
    );
    const mixTags = itemsForType.map((item) => item.tags).flat();

    const uniqeTags = mixTags.filter((v, i, a) => a.indexOf(v) === i); // In order to be sure that, tag names are not repeated

    return uniqeTags.sort((a, b) => (a.tag > b.tag ? 1 : -1)); //sort according to tag names
  };

  let allCompanies, allTags = [];
  
  let productAmountForCompanyFilter, productAmountForTagFilter;

  const page = Number(req.headers.page) || 0; //Number of page to show products


  if (req.path === "/items") {
    allCompanies = data.companies.map((company) => {
      //company list with product amounts according to given filter
      let amount = 0;
      res.locals.data.forEach((element) => {
        if (element.manufacturer === company.slug) amount += 1;
      });
      return { ...company, amount: amount };
    });

    allTags = tags().map((tag) => {
      //tag list  product amounts according to given filter
      let amount = 0;
      res.locals.data.forEach((element) => {
        if (element.tags.includes(tag)) amount += 1;
      });
      return { tagName: tag, amount: amount };
    });



    // FOR NEXT TWO VARIABLE ASSIGN:
    // IF USER SELECTS ONE ITEM FOR ANY FILTER, QUERY PROPERTIES COME AS A STRING.OTHERWISE QUERY PROPERTIES COME AS ARRAY.

    productAmountForCompanyFilter = data.items.filter(
      (item) =>
        item.tags.some((r) => {
          if (req.query?.tags) {
            if (Array.isArray(req.query?.tags)) {
              return req.query?.tags.includes(r);
            } else {
              return req.query.tags === r;
            }
          } 
            return true;
          
        }) && item.itemType === req.query.itemType
    ).length;

    productAmountForTagFilter = data.items.filter(
      (item) =>
        item.itemType === req.query.itemType &&
        (() => {
          if (req.query.manufacturer) {
               if (Array.isArray(req.query.manufacturer)) {
                 //
                 return req.query?.manufacturer.includes(item.manufacturer);
               } else {
                 return req.query?.manufacturer === item.manufacturer;
               }
          }
          return true
       
        })
    ).length;
  }

  res.jsonp({
    tags: allTags, //tags with product amounts according to given filter
    companies: allCompanies, //companies with product amounts according to given filter
    totalItemAmount: res.locals.data.length, // Total product amount for page numbers
    data: res.locals.data.slice(page * 16, page * 16 + 16), // Products to show per page.
    // These two variables show the total product amount for selection of "All" from filter.
    productsAmountsForCompanies: productAmountForCompanyFilter,
    productsAmountsForTags: productAmountForTagFilter,
  });
};

server.use(router);

server.listen(process.env.PORT || 3000, () => {
  console.log("JSON Server is running");
});
