import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {

  onSubmit = (e) => {
    e.preventDefault();
    this.save();
  }

  uploadImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.hidden = true;
    document.body.appendChild(input);
    
    input.addEventListener('change', async () => {
      const file = input.files[0];

      if (!file) { return; }
  
      let imageUrl;
      const formData = new FormData();
  
      formData.append("image", file);

      this.subElements.productForm.uploadImage.classList.add("is-loading");
      this.subElements.productForm.uploadImage.disabled = true;

      try {
        const url = new URL('https://api.imgur.com/3/image');
        const params = {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
          body: formData,
        };
        const { data: { link } } = await fetchJson(url, params);
        imageUrl = link;

        this.images.push({
          url: imageUrl,
          source: file.name,
        });
  
        this.renderImageList();
        
      } catch (e) {
        throw new Error(e);
      } finally {
        this.subElements.productForm.uploadImage.classList.remove("is-loading");
        this.subElements.productForm.uploadImage.disabled = false;
      }
    });

    input.click();
  }

  constructor (productId) {
    this.productId = productId;
    this.categories = [];
    this.formData = {
      status: 1,
      title: '',
      description: '',
      discout: 0,
      price: 0,
      quantity: 0,
      images: [],
    };
    this.isEdit = !!productId;
    this.images = [];
  }

  renderCategories() {
    const result = [];
    for (let category of this.categories) {
      for (let subcategory of category.subcategories) {
        result.push(new Option(category.title + " > " + subcategory.title, subcategory.id));
      }
    }
    const wrapper = document.createElement('div');
    wrapper.append(...result);

    return wrapper.innerHTML;
  }

  fetchCategories() {
    const categoryUrl = new URL('/api/rest/categories', BACKEND_URL);

    categoryUrl.searchParams.set('_sort', 'weight');
    categoryUrl.searchParams.set('_refs', 'subcategory');

    return fetchJson(categoryUrl);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.element.remove();
    this.element = null;
    this.subElements = null;
  }

  initEventListeners() {
    this.subElements.productForm.uploadImage.addEventListener('pointerdown', e => this.uploadImage(e));
    this.subElements.productForm.addEventListener("submit", e => this.onSubmit(e));
  }

  getImageListItemTemplate({url, source}) {
    const li = document.createElement("li");
    li.className = "products-edit__imagelist-item";
    li.innerHTML = `<input type="hidden" name="url" value="${url}">
    <input type="hidden" name="source" value="${source}">
    <span>
      <img src="icon-grab.svg" data-grab-handle="" alt="grab">
      <img class="sortable-table__cell-img" alt="Image" src="${url}">
      <span>${source}</span>
    </span>
    <button type="button">
      <img src="icon-trash.svg" data-delete-handle="" alt="delete">
    </button>`;

    return li;
  }

  getImageListTemplate() {
    if (!this.images.length) {
      return [];
    }

    const listItems = [];

    for (let image of this.images) {
      listItems.push(this.getImageListItemTemplate(image));
    }

    return listItems;
  }

  renderImageList() {
    const arr = this.getImageListTemplate();
    this.subElements.imageListContainer.firstElementChild.append(...arr);
  }

  template() {
    return `
    <div class="product-form">
      <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
          <fieldset>
            <label class="form-label">Название товара</label>
            <input required="" type="text" name="title" class="form-control" placeholder="Название товара">
          </fieldset>
        </div>
        <div class="form-group form-group__wide">
          <label class="form-label">Описание</label>
          <textarea required="" class="form-control" name="description" data-element="productDescription" placeholder="Описание товара"></textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
          <label class="form-label">Фото</label>
          <div data-element="imageListContainer">
            <ul class="sortable-list">
            </ul>
          </div>
          <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
        <div class="form-group form-group__half_left">
          <label class="form-label">Категория</label>
          <select class="form-control" name="subcategory" id="subcategory">
          ${this.renderCategories()}
          </select>
        </div>
        <div class="form-group form-group__half_left form-group__two-col">
          <fieldset>
            <label class="form-label">Цена ($)</label>
            <input required="" type="number" name="price" class="form-control" placeholder="100">
          </fieldset>
          <fieldset>
            <label class="form-label">Скидка ($)</label>
            <input required="" type="number" name="discount" class="form-control" placeholder="0">
          </fieldset>
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Количество</label>
          <input required="" type="number" class="form-control" name="quantity" placeholder="1">
        </div>
        <div class="form-group form-group__part-half">
          <label class="form-label">Статус</label>
          <select class="form-control" name="status">
            <option value="1">Активен</option>
            <option value="0">Неактивен</option>
          </select>
        </div>
        <div class="form-buttons">
          <button type="submit" name="save" class="button-primary-outline">
            Сохранить товар
          </button>
        </div>
      </form>
    </div>`;
  }

  getFormData() {
    const { productForm: form} = this.subElements;
    const {title, description, subcategory, price, quantity, discount, status} = form;

    return {
      id: this.productId,
      title: title.value,
      description: description.value,
      subcategory: subcategory.value,
      price: parseInt(price.value, 10),
      quantity: parseInt(quantity.value, 10),
      discount: parseInt(discount.value, 10),
      status: parseInt(status.value, 10),
      images: [],
    };
  }


  async save() {
    const url = new URL('/api/rest/products', BACKEND_URL);
    const formData = this.getFormData();
    formData.images = this.images;

    const params = {
      method: this.isEdit ? "PATCH" : "PUT",
      headers: {
        'content-type': 'application/Json',
      },
      body: JSON.stringify(formData),
    };
    
    try {
      const detail = await fetchJson(url, params);
      const event = this.isEdit ? new CustomEvent("product-updated", { detail}) : new CustomEvent("product-saved", {detail});
      this.element.dispatchEvent(event);
    } catch (e) {
      throw new Error(e);
    }
  }


  setFormFields() {
    const selectedStatus = this.product.status || 1;
    const title = this.product.title || '';
    const description = this.product.description || '';
    const discount = this.product.discount || 0;
    const price = this.product.price || 0;
    const quantity = this.product.quantity || 0;
    const images = this.product.images || [];

    this.subElements.productForm.status.value = selectedStatus;
    this.subElements.productForm.title.value = escapeHtml(title);
    this.subElements.productForm.description.value = escapeHtml(description);
    this.subElements.productForm.discount.value = discount;
    this.subElements.productForm.price.value = price;
    this.subElements.productForm.quantity.value = quantity;

    this.images = images;
  }

  fetchProduct() {
    const formDataUrl = new URL('/api/rest/products', BACKEND_URL);

    formDataUrl.searchParams.set('id', this.productId);

    return fetchJson(formDataUrl);
  }

  renderForm() {
    const element = document.createElement('div');
    element.innerHTML = this.template();

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements();
  }

  async render () {
    const categoriesPromises = this.fetchCategories();
    const productPromise = this.isEdit
      ? this.fetchProduct()
      : Promise.resolve(this.formData);
    
    const [categoriesData, productResponse] = await Promise.all([categoriesPromises, productPromise]);
    
    this.product = productResponse.length ? productResponse.at(0) : productResponse;
    this.categories = categoriesData;

    this.renderForm();

    if (this.product) {
      this.setFormFields();
      this.renderImageList();
      this.initEventListeners();
    }

    return this.element;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");
  
    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }
  
    return result;
  }
}
