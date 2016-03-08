var infohbtemp =
  [
    '<p class="ac-name">{{labels}}</p>',
    '<p class="ac-node-type"><i class="fa fa-info-circle"></i> {{#if Addr}}{{addr}}{{else if OrgNo}}{{orgno}}{{else if Xref}}{{role}}{{else}}{{name}}{{/if}}</p>',
    '{{#if Movie}}<p class="ac-milk"><i class="fa fa-angle-double-right"></i> {{tagline}}</p>{{/if}}',
    '<p class="ac-more"><i class="fa fa-external-link"></i> <a target="_blank" href="https://www.google.com.au/search?q={{name}}">More information</a></p>'
  ].join('');
