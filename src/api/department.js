const handleAsync = require('../utilities/toHandleAsync');
const Product = require('../models/deptProducts');
const Departments = require('../models/_department');

/**
 * !PATH: /api/v1/departments
 * returns all the available product departments
 */
const getAllDepartments = handleAsync(async (req, res, next) => {
    const departmentArray = new Array();

    for (let i = 0; i !== Departments.length; i++) {
        const department = Departments[i];
        const [d_Id, products] = Object.keys(department);
        const departmentId = department[d_Id];
        const deptProducts = department[products]
        // console.log(departmentId)
        // console.log(deptProducts)
        const departmentProductsNum = await Product
            .findOne({ products: deptProducts })
        const prod = departmentProductsNum.products
            // console.log(prod.length)

        departmentArray.push({
            department_name: departmentId,
            department_numProducts: prod.length
        })
    }

    res.json({
        success: true,
        datatype: 'ALL DEPARTMENTS',
        numOfResults: departmentArray.length,
        data: departmentArray
    })
})

/**
 * !PATH: /api/v1/departments/:deptId
 * returns all the available products on a given department
 */
const getAllDepartmentProducts = handleAsync(async (req, res, next) => {

    const productsDoc = await Product.findOne({ d_Id: req.params.deptId })
    // .countDocuments(); counts the number of documents that has the field of interest, not needed here
    const numOfDeptProducts = productsDoc.products

    // I think this helps with pagination
    const departmentProductsArray = await Product
        .findOne({ d_Id: req.params.deptId })
        .select('products') //Used to remove or pick out the exact properties you want
        .limit(req.searchLimit)
        .skip(req.searchSkip);
        console.log(departmentProductsArray)

    const response = {
        success: true,
        datatype: "ALL DEPARTMENT'S PRODUCTS",
        numOfResults: numOfDeptProducts.length,
        lastPage: Math.ceil(numOfDeptProducts.length / req.searchLimit),
        page: req.searchPage,
        data: departmentProductsArray
    }

    if (response.lastPage == 0)
        throw new res.withError(`No results found`, 404)

    if (response.page > response.lastPage)
        throw new res.withError(`You've reached the last page, LAST PAGE: ${response.lastPage}`, 404)

    res.json(response)
})


/**
 * !PATH: /api/v1/departments/:deptId/toprated
 * returns all the available products on a given department with ratings more than 4
 */
const getAllTopRated = handleAsync(async (req, res, next) => {

    const numOfDeptProducts = await Product
        .find({
            product_departmentId: req.params.deptId,
            product_ratings: { $gte: 4, $lte: 5 }
        })
        .countDocuments();

    const departmentTopRated = await Product
        .find({
            product_departmentId: req.params.deptId,
            product_ratings: { $gte: 4, $lte: 5 }
        })
        .sort({ product_ratings: 'descending' })
        .select('-product_reviews -product_description -__v')
        .limit(req.searchLimit)
        .skip(req.searchSkip);

    const response = {
        success: true,
        datatype: "ALL DEPARTMENT'S TOP RATED PRODUCTS. Starting from the highest rating",
        numOfResults: departmentTopRated.length,
        lastPage: Math.ceil(numOfDeptProducts / req.searchLimit),
        page: req.searchPage,
        data: departmentTopRated
    }

    if (response.lastPage == 0)
        throw new res.withError(`No results found`, 404)

    if (response.page > response.lastPage)
        throw new res.withError(`You've reached the last page, LAST PAGE: ${response.lastPage}`, 404)

    res.json(response)
})


/**
 * !PATH: /api/v1/departments/:deptId/topsales
 * returns all the available products on a given department with sales more than 1000
 */
const getAllTopSales = handleAsync(async (req, res, next) => {

    const numOfDeptProducts = await Product
        .find({
            product_departmentId: req.params.deptId,
            product_sales: { $gte: 1000 }
        })
        .countDocuments();

    const departmentTopSales = await Product
        .find({
            product_departmentId: req.params.deptId,
            product_sales: { $gte: 1000 }
        })
        .sort({ product_sales: 'descending' })
        .select('-product_reviews -product_description -__v')
        .limit(req.searchLimit)
        .skip(req.searchSkip);

    const response = {
        success: true,
        datatype: "ALL DEPARTMENT'S TOP SALES PRODUCTS. Starting from the highest sales",
        numOfResults: departmentTopSales.length,
        lastPage: Math.ceil(numOfDeptProducts / req.searchLimit),
        page: req.searchPage,
        data: departmentTopSales
    }

    if (response.lastPage == 0)
        throw new res.withError(`No results found`, 404)

    if (response.page > response.lastPage)
        throw new res.withError(`You've reached the last page, LAST PAGE: ${response.lastPage}`, 404)

    res.json(response)
})


module.exports = {
    getAllDepartments,
    getAllDepartmentProducts,
    getAllTopRated,
    getAllTopSales
}