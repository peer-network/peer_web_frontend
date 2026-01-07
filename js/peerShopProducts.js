
let peerShopProducts = {};

function loadPeerShopProducts() {
   db.collection("shop").get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        peerShopProducts[doc.id] = doc.data();
      });
    })
    .catch(err => console.error("Error loading peer shop products:", err));
};

function getProductByPostId(postId) {
  return peerShopProducts[postId] || null;
}

loadPeerShopProducts();