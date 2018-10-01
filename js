function addEven (nums) {
  return nums.reduce((sum, e) => (e%2 == 0 ? sum += e : sum), 0)    
}

console.log(addEven([1,2,3,4, 9, 8]))

