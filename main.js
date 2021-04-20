var eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div>
  <div class="product">
  <div class="product-image">
    <img v-bind:src="img" />
  </div>
  <div class="product-info">
    <h1>{{title}}</h1>
    <p v-if="inventory>10">In Stock</p>
    <p v-else-if="inventory<=10 && inventory>0">Almost Sold Out!</p>
    <p v-else>Out of Stock</p>
    <p> Shipping is: {{shipping}} </p>
    <ul>
      <li v-for="detail in details">{{detail}}</li>
    </ul>
    <div
      v-for="(variant,index) in variants"
      :key="variant.variantId"
      class="colorBox"
      :style="{backgroundColor:variant.variantColor}"
      @mouseover="updateProduct(index)"
    ></div>
      <button
        class="abledBtn"
        v-on:click="addToCart"
        :disabled="inventory<=0"
        :class="{disabledBtn:inventory<=0}"
      >
        Add to Cart
      </button>
  </div>
</div>
<product-tabs :reviews="reviews"></product-tabs>

</div>`,
  data() {
    return {
      brand: "Yaju's",
      product: "Socks",
      selectedVariant: 0,
      details: ["100% cotton", "weather-proof"],
      variants: [
        {
          variantId: 55,
          variantColor: "Green",
          variantImage: "assets/vmSocks-green.png",
          variantQuantity: 12,
        },
        {
          variantId: 56,
          variantColor: "Blue",
          variantImage: "assets/vmSocks-blue.png",
          variantQuantity: 5,
        },
      ],
      reviews: [],
    };
  },
  methods: {
    addToCart: function () {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
      this.variants[this.selectedVariant].variantQuantity -= 1;
    },
    updateProduct: function (index) {
      this.selectedVariant = index;
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    img() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inventory() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      } else {
        return "$3.5";
      }
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

Vue.component("product-review", {
  template: `
    <form class="review-form" @submit.prevent="onSubmit">
      <div v-if="errors.length">
        <p>Please correct the following errors:</p>
        <ul>
        <li v-for="error in errors">{{error}}</li>
        </ul>
      </div>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>
      
      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>
      
      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>
          
      <p>
        <input type="submit" value="Submit">  
      </p>    
    
    </form>`,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      errors: [],
    };
  },

  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        };
        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
      } else {
        if (!this.name) this.errors.push("Name required.");
        if (!this.review) this.errors.push("Review required.");
        if (!this.rating) this.errors.push("Rating required.");
      }
    },
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
    <div class="tab">
    <span 
    v-for="(tab,index) in tabs" 
    :class="{ activeTab: selectedTab === tab }"
    :key="index"
    @click="selectedTab=tab"
    >{{tab}}</span>
    <div v-show="selectedTab==='Reviews'" class="header-form">
        <h2>Reviews</h2>
        <p v-if="!reviews.length">There are no reviews</p>
        <ul>
            <li v-for="review in reviews">
            <p>{{review.name}}</p>
            <p>{{review.rating}}</p>
            <p>{{review.review}}</p>
            </li>
        </ul>
    </div>
<product-review v-show="selectedTab==='Make a Review'"></product-review>
    </div>`,
  data() {
    return {
      tabs: ["Reviews", "Make a Review"],
      selectedTab: "Reviews",
    };
  },
});

var app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
  },
});
