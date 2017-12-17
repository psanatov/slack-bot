// controllers/emojis

const emojis = [
  "whew", 
  "evilgrin", 
  "makeup", 
  "t", 
  "deda", 
  "wonder", 
  "skype_punch", 
  "skype_bell"];

// Random emoji getter
module.exports = {
  getEmoji: function getEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)];
  }  
}
