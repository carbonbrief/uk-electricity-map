// let plantShapes = [
//     {
//         name: "coal",
//         d: "M961.5,659l5.7,241.6L837.8,912l-292-25.7l-54.2,5.7l-30.4-2.9l-1-7.6l-83.7-3.8l-1.9-82.8l-123.7,92.3l-16.2,1.9l-1.9-19l156-118.9v-42.8l-4.8-5.7c0,0,3.8-1.9,4.8-3.8c1-1.9,1.9-89.4,1.9-89.4l-5.7-2.9c0,0,5.7,0,5.7-2.9s1.9-61.8,1.9-61.8l-5.7-3.8c0,0,3.8-1,4.8-2.9c1-1.9,1.9-19,1.9-19l11.4-2.9l9.5,3.8v15.2l4.8,5.7l-3.8,2.9l1,62.8l4.8,3.8l-3.8,2.9l1,84.7l2.9,7.6l-3.8,3.8l1,20l8.6-3.8v-40l34.2-4.8v-7.6l26.6-5.7l55.2,2.9v4.8H580v-16.2l7.6-6.7l7.6,5.7l5.7,1v16.2l19-1V542l-5.7-3.8l5.7-3.8l1.9-137.9l-3.8-7.6l17.1-2.9l16.2,3.8l-3.8,3.8l3.8,138.9l3.8,5.7l-2.9,3.8l4.8,149.3l32.3-6.7v-21.9l8.6-7.6l6.7,4.8v19l3.8-1V524.9l-5.7-9.5l5.7-1.9l3.8-164.6l-6.7-2.9l1.9-5.7l10.5-1l12.4,1.9v5.7l-2.9,1.9l5.7,160.8l6.7,7.6l-3.8,2.9l3.8,146.5l63.7-20.9l33.3-4.8l21.9,1.9V488.7l-9.5-5.7l8.6-5.7l1-176.9l-4.8-5.7V289l15.2-1l12.4,1l-1,7.6l-4.8,1.9l9.5,174.1l8.6,6.7l-6.7,5.7l10.5,186.4l35.2,2.9l-1.9-13.3l11.4-1L961.5,659z"
//     },
//     {
//         name: "nuclear",
//         d: "M740.5,421.5c-159.2-139.1-650-188-650-188l38,925l827-218C955.5,940.5,890.2,552.3,740.5,421.5z"
//     }
// ]


// var morph = anime({
//     targets: '.morph-path',
//     d: [
//         {value: plantShapes[1].d}
//     ],
//     duration: 5000,
//     direction: 'alternate',
//     autoplay: true,
//     easing: 'linear',
//     elasticity: 100,
//     loop: true
// });

let shapes = [
    {
        name: "Coal",
        hex: "#ced1cc",
        value: "1007.5,667 1015.5,910 887.5,915 570.5,892 570.5,900 513.5,908 482.5,903 482.5,896.4 396.5,888 395.4,805.4 239.5,922 220.5,924 199.5,923 203.5,819 106.5,817 106.5,809 142.5,808 210.5,759 216.5,759 234.5,776 241.5,776 245.5,772 249.5,772 261.5,772 262.5,777 276.5,776 276.5,803 271.5,807 271.5,816 263.5,816 262.5,872 404.5,763 405.5,719 400.5,714 400.5,709 405.5,709 408.5,617 401.5,613 401.5,608 407.5,608 409.5,545 403.5,541 402.5,536 408.5,536 409.5,515 416.5,514 424.5,514 432.5,517 432.5,535 436.5,536 436.5,540 433.5,542 434.5,607 438.5,608 438.5,612 434.5,614 436.5,708 439.5,708 440.5,714 436.5,717 436.5,739 441.5,735 441.5,718 444.5,717 444.5,693 481.5,686 481.5,679 511.5,673 568.5,675 568.5,681 606.5,681 606.5,664 607.5,659 611.5,656 616.5,655 620.5,657 622.5,659 623.5,662 630.5,662 630.5,681 647.5,680 649.5,544 644.5,541 644.5,536 648.5,536 650.5,391 647.5,386 647.5,381 656.5,379 668.5,379 676.5,380 680.5,382 680.5,387 676.5,389 682.5,535 685.5,535 685.5,540 683.5,543 688.5,701 704.5,699 704.5,695 721.5,692 721.5,669 723.5,669 725.5,666 730.5,663 735.5,663 738.5,666 740.5,669 742.5,525 735.5,522 734.5,515 741.5,514 743.5,341 739.5,338 739.5,331 748.5,330 755.5,330 762.5,331 765.5,333 765.5,338 761.5,339 768.5,510 776.5,513 776.5,519 769.5,524 775.5,675 841.5,656 840.5,652 877.5,647 898.5,648 899.5,487 891.5,483 891.5,477 898.5,474 899.5,289 894.5,285 893.5,279 903.5,276 914.5,276 923.5,278 922.5,284 918.5,287 928.5,471 936.5,473 936.5,479 929.5,483 938.5,681 978.5,684 978.5,668 987.5,667 1007.5,667 	"
    },
    {
        name: "Nuclear",
        hex: "#dd54b6",
        value: "1069.5,576.5 1069.5,604.6 1069.5,643.2 1069.5,677.7 1069.5,717.5 1032.5,718.9 989.5,720.5 989.5,729.5 953.1,731.9 913.5,734.5 859.1,734.2 828.1,734 794.4,733.8 761.5,733.6 738.5,733.5 738.5,724.5 721.5,724.5 721.5,731.5 689.5,733.5 661.3,733 629.4,732.5 591.7,731.9 564.5,731.5 564.5,723.5 529.2,722.9 490.6,722.2 467.1,721.8 461.8,722.8 446.5,721.5 446.5,729.5 418.4,731.2 383.3,733.4 348.5,735.5 316.4,735 278.7,734.5 236.6,733.9 193.6,733.2 150.6,732.6 109.3,732 73.5,731.5 73.8,704.4 74.1,663.6 74.5,626.5 86.5,626.5 86.5,614.5 98.5,613.5 115.5,614.5 115.5,626.5 137.3,627 158.5,627.5 158.5,622.5 171.5,622.5 171.5,601.9 171.5,582.5 196.2,581 215.8,579.9 239.5,578.5 239.5,562.5 235.5,559.5 235.5,553.5 239.5,552.5 241.5,538.5 245.5,524.5 251.5,513.5 258.5,502.5 267.5,492.5 278.5,484.5 292.5,477.5 303.5,473.5 317.5,470.5 331.5,469.5 345.5,470.5 358.5,472.5 369.5,478.5 379.5,484.5 388.5,491.5 396.5,499.5 402.5,507.5 408.5,517.5 412.5,527.5 415.5,538.5 417.5,548.5 418.5,555.5 421.5,556.5 421.5,562.5 417.5,564.5 417.5,581.5 440.5,583.5 440.5,588.5 454.5,588.5 454.5,580.5 458.5,579.5 458.5,583.5 472.5,581.5 484.5,582.5 494.5,581.5 503.5,583.5 503.5,588.5 532.3,591.2 557.5,593.5 576.5,592.5 590.5,594.5 590.5,597.5 612.6,599.3 645.4,601.9 665.5,603.5 665.5,606.5 670.5,605.5 670.5,601.5 684.8,600.4 697.5,599.5 698,576.2 698.5,551.5 711,551 725.5,550.5 725.5,530.5 726.5,514.5 729.5,499.5 735.5,483.5 743.5,469.5 752.5,456.5 763.5,445.5 776.5,437.5 793.5,429.5 810.5,424.5 824.5,421.5 840.5,420.5 857.5,422.5 871.5,425.5 884.5,431.5 897.5,438.5 910.5,448.5 919.5,457.5 926.5,466.5 932.5,478.5 937.5,491.5 940.5,503.5 942.5,516.5 943.5,522.5 947.5,522.5 947.5,527.5 943.5,531.5 957.5,530.5 969.5,533.5 969.5,548.5 991.3,553.2 1011.5,557.5 1026.5,555.5 1033.5,558.5 1033.5,568.5 1051,572.4 1069.5,576.5"
    },
    {
        name: "Solar",
        hex: "#ffc83e",
        value: "1094.5,454.9 1094.5,464.6 1085.8,496.1 1076.6,529.4 1070.7,550.5 1062.9,578.9 1041,574.1 1027.7,619.9 1017.7,654.7 1012.1,673.8 1005.3,697.3 972.9,688.4 960,733.2 952.2,760.6 945.1,785.4 937.7,811.2 928.3,844 883.4,829.3 844,816.4 831,857 787.7,842.5 758.5,832.8 732.2,824 704.6,814.8 698.9,798.6 705.4,784 702.1,768.6 668,757.3 646,750 601.6,735.4 596.8,724.8 611.5,695.6 623.5,671.7 637.4,644 655.9,607.3 649.5,604.9 642.2,621.9 637.3,620.3 620.7,653 606.2,681.6 593.8,706 582.2,728.9 579.7,728.1 567.6,751.5 559.5,767 532.5,758.1 511.7,751.2 481.8,741.3 458.9,733.8 450,716.7 457.3,703.8 448.4,683.5 418.7,673.8 394.7,666 367.5,657.1 334.1,646.2 328.4,637.3 344.3,614.7 359.4,593.2 374.2,572.1 403,531.1 396.5,529.5 390,538.4 384.4,536 368.7,556.9 355.2,574.9 356,582.2 327.2,620 307.5,645.8 291.1,667.3 263.3,658.3 244.1,652.1 206,639.7 202,625.1 211.7,610.5 201.2,586.2 174.6,574.9 150.5,564.7 126.8,554.6 109.6,547.3 105.5,536.8 119.2,524.3 138.6,506.6 166.5,481.2 196.3,454.1 219.8,458.8 248.2,464.6 269.9,442.2 287.6,423.9 304.6,406.4 321.9,388.4 354.4,396.5 368.5,380.7 380.3,367.6 402.2,343 425.6,347.6 460.1,354.5 482.9,359 520.2,366.4 549.1,372.1 574.1,377.1 575.7,385.2 555.2,413.5 542.7,430.9 529.5,449.2 512.4,446 506.8,453.3 496.2,450.8 478,476.9 461.5,500.4 441.1,529.5 452.5,531.9 472.9,502.7 490.4,477.6 512.4,446 543.3,451.6 557.1,431.6 570.1,412.7 591.9,381.1 638.4,388.1 683.8,394.8 727.9,401.4 767.7,407.4 809.1,413.5 810.8,422.5 800.3,444.1 787.6,470.4 774.3,497.9 755.6,494.6 745.9,515.7 733.8,513.3 718.8,543.7 707.6,566.7 694,594.3 704.6,597.6 719.8,567.5 733.5,540.4 742.7,522.2 755.6,494.6 782.4,499.5 797.7,470.1 809.2,447.9 826.2,415.2 856.5,419.7 891.2,424.8 929.7,430.5 960.6,435.1 995,440.2 1032.4,445.7 1062.7,450.2 1094.5,454.9 1094.5,454.9 "
    },
    {
        name: "Wind",
        hex: "#00a98e",
        value: "726.5,532 727.1,543 723.5,633 721.5,653 748.5,663 818.5,724 819.5,730 812.5,729 808.5,726 808.5,762 807.5,774 821.5,782 853.5,811 855.5,816 849.5,815 816.5,790 807.5,783 805.5,786 807,843.7 808.5,902 827.5,900 842.5,898 862.5,902 893.3,901 916.9,902 926.5,902 926.5,939 271.5,934 271.5,902 292.1,898 318.8,901.9 348.4,902 350.9,815.7 353.9,711.8 340.7,730 299.3,761.7 287.3,768.2 294.5,757.2 335.7,714.8 349.7,703.9 352.6,697.5 338.2,679.7 322,621 321,607.3 329,619.3 354.7,674.7 359.4,691.1 365.9,698.6 389.6,701.6 436.7,727.8 446.7,736.1 434.4,734.4 378.6,713.1 364.9,707.6 362.1,713.1 363.7,821 364.9,902 393.9,902 418.5,898.1 447.8,903 475,901.5 506.5,902 507.9,859.7 510.6,781.2 514.2,674.7 517.4,580.2 520.5,489 459.5,639 451.5,645 452.5,631 505.5,471 520.5,428 518.5,419 491.5,406 440.5,340 378.5,271 373.5,261 386.5,269 506.5,387 523.5,406 537.5,414 564.5,404 747.5,382 761.5,383 749.5,388 567.5,424 539.5,426 541.5,433 539.5,440 538.9,575 538.4,684 538.1,773.2 537.7,855.6 537.5,902 567.3,899 601.5,902 603.5,835 599.5,841 582.5,853 588.5,844 600.5,832 601.5,827 593.5,805 592.5,796 597.5,802 604.5,817 605.5,825 607.5,827 615.5,827 636.5,835 639.5,837 634.5,838 614.5,834 607.5,832 606.5,834 607.5,902 635.9,901.9 657.3,900 679.8,900 751.7,904 798.5,902 799,843.7 799.5,783 791.5,790 750.5,805 744.5,806 749.5,800 794.5,778 799.5,776 797.5,764 801.5,721 735.5,675 721.5,663 721.5,669 722.1,743.9 722.9,833 723.5,903 709.5,903 710.4,834.4 711.4,750.6 712.5,668 710.5,664 699.5,676 611.5,708 604.5,709 610.5,702 689.5,663 709.5,656 712.5,653 707.5,631 721.5,541 726.5,532 "
    }
];

let index= 0;

function animate () {

    anime({
        targets: '.morph-path',
        points: [
            shapes[index].value
        ],
        duration: 600,
        stroke: shapes[index].hex,
        autoplay: true,
        elasticity: 100
    });

    if (index < 3) {
        index++;
    } else {
        index = 0;
    }

    // console.log(index);

}

function schedule() {
    setTimeout(() => {
        animate();
        schedule();
    }, 3000);
}

schedule();