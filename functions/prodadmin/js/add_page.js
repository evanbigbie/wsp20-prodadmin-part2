function add_page() {
    add_page_secured()
}

// need to pass info from one fn to another: use global variable:
let glImageFile2Add; // file selected by imageButton

// input tag good for 1 line (Name), need textarea tag for multiple lines
function add_page_secured() {
    glPageContent.innerHTML = '<h1>Add Page</h1>'
    glPageContent.innerHTML += `
        <a href='/home' class="btn btn-outline-primary">Home</a>
        <a href='/show' class="btn btn-outline-primary">Show Products</a>
        <div class="form-group">
            Name: <input class="form-control" type="text" id="name" />
            <p id="name_error" style="color:red;" />
        </div>
        <div class="form-group">
            Condition: <input class="form-control" type="text" id="condition" />
            <p id="condition_error" style="color:red;" />
        </div>
        <div class="form-group">
            Summmary: <br>
            <textarea class="form-control" id="summary" cols="40" rows="5"></textarea>
            <p id="summary_error" style="color:red;" />
        </div>
        <div class="form-group">
            Price: <input class="form-control" type="text" id="price" />
            <p id="price_error" style="color:red;" />
        </div>
        <div class="form-group">
            Quantity: <input class="form-control" type="text" id="quantity" />
            <p id="quantity_error" style="color:red;" />
        </div>
        <div class="form-group">
            Image: <input type="file" id="imageButton" value="upload" />
            <p id="image_error" style="color:red;" />
        </div>
        <button class="btn btn-primary" type="button" onclick="addProduct()">Add</button>
    `;

    // name of image file: e.target.files[0] will be stored in global variable when image selected
    const imageButton = document.getElementById('imageButton')
    imageButton.addEventListener('change', e => {
        glImageFile2Add = e.target.files[0]
        // console.log('file upload' , e.target.files[0])
    })
}

async function addProduct() {
    const name = document.getElementById('name').value
    const condition = document.getElementById('condition').value
    const summary = document.getElementById('summary').value
    let price = document.getElementById('price').value
    let quantity = document.getElementById('quantity').value

    // input validation
    const nameErrorTag = document.getElementById('name_error')
    const conditionErrorTag = document.getElementById('condition_error')
    const summaryErrorTag = document.getElementById('summary_error')
    const priceErrorTag = document.getElementById('price_error')
    const quantityErrorTag = document.getElementById('quantity_error')
    const imageErrorTag = document.getElementById('image_error')

    nameErrorTag.innerHTML = validate_name(name)
    conditionErrorTag.innerHTML = validate_condition(condition)
    summaryErrorTag.innerHTML = validate_summary(summary)
    priceErrorTag.innerHTML = validate_price(price)
    quantityErrorTag.innerHTML = validate_quantity(quantity)
    imageErrorTag.innerHTML = !glImageFile2Add ? 'Error: image file not selected' : null

    if (nameErrorTag.innerHTML || conditionErrorTag.innerHTML || summaryErrorTag.innerHTML 
        || priceErrorTag.innerHTML || quantityErrorTag.innerHTML || imageErrorTag.innerHTML) {
            return
        }

    // now ready to add the product into firebase
    // upload image into database and then get uploaded image URL for use
    try {
        const image = Date.now() + glImageFile2Add.name // unique name
        const ref = firebase.storage().ref(IMAGE_FOLDER + image) // organize by folder in firestore
        const taskSnapshot = await ref.put(glImageFile2Add) // stores image into IMAGE_FOLDER location def'd in .html
        const image_url = await taskSnapshot.ref.getDownloadURL() // get URL of just uploaded image, can display, etc

        // product: name, condition, summary, price, quantity in Firestore
        //name = name.replace(/ +/g, "")
        price = Number(price)
        quantity = Number(quantity)
        await firebase.firestore().collection(COLLECTION).doc()
            .set({name, condition, summary, price, quantity, image, image_url})

        // // console.log('image_url', image_url)
        // glPageContent.innerHTML = `
        //     <h1>${name} is added</h1>
        //     <h3>Condition: ${condition}<br />Qty: ${quantity}</h3>
        //     <a href="/show" class"btn btn-outline-primary">Show all</a>
        // `;

        // console.log('image_url', image_url)
        glPageContent.innerHTML = `
        <div class="media">
            <img src="${image_url}" class="mr-3" alt="xxx">
            <div class="media-body">
                <h5 class="mt-0">${name} is added</h5>
                Condition: ${condition}<br />Price: ${price}<br />Qty: ${quantity}
            </div>
        </div>
    `;

    } catch (e) {
        // JSON.stringify() makes sure that whatever it is it will print to screen
        glPageContent.innerHTML = `
            <h1>Cannot add a product</h1>
            ${JSON.stringify(e)}
        `;
    }
}