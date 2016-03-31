module.exports = {
    project:[
        {
            "alias":"discover_picture",
            "src":"./src/",
            "build":"./build/"
        }
    ],
    vendorJs:[
        "vendor/jquery/dist/jquery.min.js",
        "vendor/swipebox/src/js/jquery.swipebox.js"
        
    ],
    vendorCss:[
        
    ],
    getVendors:function(pro){
        var js = this.vendorJs.slice(0),
            css = this.vendorCss.slice(0),
            dir = pro.src,
            re = js.concat(css);

        return re.map(function(item){ return dir + item ;})
    }
};