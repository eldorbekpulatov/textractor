$(function() {
    // the input field
    var $input = $("input[type='search']")[0],
    // enter button
    $enterBtn = $("button[data-search='enter']"),
    // clear button
    $clearBtn = $("button[data-search='clear']"),
    // prev button
    $prevBtn = $("button[data-search='prev']"),
    // next button
    $nextBtn = $("button[data-search='next']"),
    // the context where to search
    $content = $(".searchable"),
    // jQuery object to save <mark> elements
    $results,
    // the class that will be appended to the current
    // focused element
    currentClass = "current",
    // top offset for the jump (the search bar)
    offsetTop = 150,
    // the current index of the focused element
    currentIndex = 0,
    // grab all checkboxes
    $checkBoxes = $("input[type='checkbox']");

    /**
     * Jumps to the element matching the currentIndex
     */
    function jumpTo() {
        if ($results.length) {
            var position,
            $current = $results.eq(currentIndex);
            $results.removeClass(currentClass);
            if ($current.length) {
            $current.addClass(currentClass);
            position = $current.offset().top - offsetTop;
            window.scrollTo(0, position);
            }
        }
    }

    /**
     * Updates the match count for each dataSection
     */
    function updateMatchCount(){
        let dataSections = $(".card-body");
        for(let i = 0; i<dataSections.length; i++){
            // console.log($("#"+dataSections[i].id+".card-body").find("mark"))
            matchCountElem = $("#"+dataSections[i].id+".matchCount")[0];
            counts = $("#"+dataSections[i].id+".card-body").find("mark").length;
            matchCountElem.innerHTML = counts;
        }
    };
    

    /**
     * adds a searchable class to the corresponding data based on checkbox input
     */
    $checkBoxes.on("click", function(){
        let snippet = $("#"+this.id+".card-body");
        if ( this.checked ) {
            snippet.addClass("searchable");
        } else {
            snippet.removeClass("searchable");
            snippet.unmark();
        }
        $content = $(".searchable");
        $content.mark($input.value,  {
            separateWordSearch: true,
            done: function() {
                $results = $content.find("mark");
                currentIndex = 0;
                jumpTo();
            }
        });
        // update matchCount
        updateMatchCount();
    });

    /**
     * Searches for the entered keyword in the
     * specified context on input
     */
    $enterBtn.on("click", function() {
        // grabs whats in the input field
        let searchVal = $input.value;

        $content.unmark({
            done: function() {
            $content.mark(searchVal, {
                separateWordSearch: true,
                done: function() {
                    $results = $content.find("mark");
                    currentIndex = 0;
                    jumpTo();
                }
            });
            }
        });
        // update matchCount
        updateMatchCount();
        
    });

    /**
     * Clears the search
     */
    $clearBtn.on("click", function() {
        $content.unmark();
        $input.value = "";
    });

    /**
     * Next and previous search jump to
     */
    $nextBtn.add($prevBtn).on("click", function() {
        if ($results.length) {
            currentIndex += $(this).is($prevBtn) ? -1 : 1;
            if (currentIndex < 0) {
            currentIndex = $results.length - 1;
            }
            if (currentIndex > $results.length - 1) {
            currentIndex = 0;
            }
            jumpTo();
        }
    });
});