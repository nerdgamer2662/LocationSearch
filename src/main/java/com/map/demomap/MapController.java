package com.map.demomap;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MapController {

    @GetMapping("/map")
    public String map() {
        return "index"; // This refers to map.html in the templates folder
    }
}
