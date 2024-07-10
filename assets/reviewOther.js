(function ($) {
  'use strict';

  sr4ThemeSP.reviewOther = function () {
    // any code css
    // 1. Areviews - Reviews Importer
    // if ($('.areviews_product_item').length > 0 && typeof show_infiniti_areviews === 'function'){show_infiniti_areviews();}
  };
})(jQuery_T4NT);

jQuery_T4NT(document).ready(function ($) {
  jQuery_T4NT('body').on('reloadReview.sr4', sr4ThemeSP.reviewOther);
});
