import Ember from 'ember';

const { computed, observer, on } = Ember;

export default Ember.Controller.extend({
  options: Ember.A([{
      label: 'One',
      value: 1
    }, {
      label: 'Two',
      value: 2
    }, {
      label: 'Three',
      value: 3
    }
  ]),

  filteredOptions: computed('options.@each', 'value', function(item) {
    const regex = new RegExp(this.get('value'), 'i');

    return Ember.A(this.get('options').filter((option) => {
      return option.label.search(regex) > -1;
    }));
  }),

  optionGroups: Ember.A([{
    label: 'States',
    items: Ember.A([{
      label: 'California',
      value: 'CA'
    }, {
      label: 'New York',
      value: 'NY'
    }, {
      label: 'Washington',
      value: 'WA'
    }])
  }, {
    label: 'Numbers',
    items: Ember.A([{
      label: 'One',
      value: 1
    }, {
      label: 'One Hundred and One',
      value: 101
    }, {
      label: 'One Million',
      value: 1000000
    }])
  }, {
    label: 'People',
    items: Ember.A([{
      label: 'Bill Gates',
      value: 'BG'
    }, {
      label: 'Steve Jobs',
      value: 'SJ'
    }])
  }]),

  filteredOptionGroups: computed('optionGroups.@each.items.@each', 'value', function() {
    const regex = new RegExp(this.get('value'), 'i');

    return this.get('optionGroups').map((group) => {
      return {
        label: group.label,
        items: Ember.A(group.items.filter((option) => {
          return option.label.search(regex) > -1;
        }))
      };
    });
  }),

  actions: {
    setValue(value) {
      console.log('test');
      this.set('value', value);
    },

    setValueManually(value) {
      this.set('value', value);
    }
  },

// {
//   "searchResults": [
//     {
//       "id": "c9fc6920-e96a-48a9-b24e-876401c0055e",
//       "displayTemplate": "IMAGE_LEFT_TITLE_SUBTITLE_RIGHT",
//       "searchResultSectionId": "5b38c7e2-0dce-4f96-9b5d-70f09d726103",
//       "title": "Jamie xx",
//       "link": "/events/e621e763-1cc6-4175-89f3-5a51b643e569",
//       "sortOrder": 0,
//       "properties": {
//         "subtitle": "Show :: 8:00pm (times subject to change)",
//         "displayPrice": "$35 +",
//         "imageUrls": {
//           "original": "http://i.imgur.com/C10wajT.jpg?1",
//           "retina": "http://i.imgur.com/C10wajT.jpg?1"
//         }
//       }
//     }
//   ],
//   "searchResultSections": [
//     {
//       "id": "5b38c7e2-0dce-4f96-9b5d-70f09d726103",
//       "displayPriority": "PRIMARY",
//       "sortOrder": 0,
//       "title": "Nearby Events",
//       "link": "/search-results?q=Dale+Earnhardt&type=ARTIST"
//     }
//   ]
// }

  searchOptions: Ember.A([{
    label: 'Local Events',
    items: Ember.A([{
      type: 'x-event',
      label: 'Alabama Shakes, Two Door Cinema Club',
      value: {
        title: 'Alabama Shakes, Two Door Cinema Club',
        subtitle: 'Fox Theatre, Oakland, CA'
      }
    }, {
      type: 'x-event',
      label: 'Noisia - I wub wub dubstep',
      value: {
        title: 'Noisia - I wub wub dubstep',
        subtitle: '1015 Folsom, San Francisco, CA'
      }
    }, {
      type: 'x-event',
      label: 'Wobbleland',
      value: {
        title: 'Wobbleland',
        subtitle: 'Dolores Park, San Francisco, CA'
      }
    }, {
      type: 'x-event',
      label: 'Lady Gaga',
      value: {
        title: 'Lady Gaga',
        subtitle: 'Ruby Sky, San Francisco, CA'
      }
    }])
  }, {
    label: 'Artists',
    items: Ember.A([{
      type: 'x-artist',
      label: 'Alabama Shakes',
      value: {
        title: 'Alabama Shakes',
        subtitle: 'Artist - Alternative'
      }
    }, {
      type: 'x-artist',
      label: 'Deadmau5',
      value: {
        title: 'Deadmau5',
        subtitle: 'Artist - EDM, House'
      }
    }])
  }]),

  filteredSearchOptions: computed('searchOptions.@each.items.@each', 'value', function() {
    this.set('searchCount', 0);

    if (!this.get('value')) { return {}; }

    const regex = new RegExp(this.get('value'), 'i');

    return this.get('searchOptions').map((group) => {
      let items = Ember.A(group.items.filter((option) => {
        return option.label.search(regex) > -1;
      }));

      this.incrementProperty('searchCount', items.length);

      return {
        label: group.label,
        items
      };
    });
  }),

  searchCount: 0,

  maxResults: 2,

  resultsCutoff: computed('searchCount', function() {
    return this.get('searchCount') > this.get('maxResults');
  }),

  noResults: computed('filteredSearchOptions', function() {
    return this.get('searchCount') === 0 && this.get('value');
  })
});
