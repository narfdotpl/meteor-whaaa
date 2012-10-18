(function() {
  var Context, Model, author, currentContext, fullNameHtml, fullNameTemplate, nextContextId, render, twitterNameHtml, twitterNameTemplate;

  nextContextId = 0;

  currentContext = null;

  Context = (function() {

    function Context(template) {
      this.template = template;
      this.id = nextContextId;
      nextContextId += 1;
      this.cssId = "pretty_random_" + this.id;
      this.isValid = true;
      currentContext = this;
    }

    Context.prototype.invalidate = function() {
      this.isValid = false;
      return $("#" + this.cssId).replaceWith(render(this.template));
    };

    Context.prototype.render = function() {
      return "<div id='" + this.cssId + "'>" + (this.template()) + "</div>";
    };

    return Context;

  })();

  Model = (function() {

    function Model(attributes) {
      this.attributes = attributes;
      this.contextsByKey = {};
    }

    Model.prototype.get = function(key) {
      var _base, _ref;
      ((_ref = (_base = this.contextsByKey)[key]) != null ? _ref : _base[key] = []).push(currentContext);
      return this.attributes[key];
    };

    Model.prototype.set = function(key, value) {
      var context, _i, _len, _ref;
      this.attributes[key] = value;
      _ref = this.contextsByKey[key];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        context = _ref[_i];
        if (context.isValid) context.invalidate();
      }
      return null;
    };

    return Model;

  })();

  render = function(template) {
    var context;
    context = new Context(template);
    return context.render();
  };

  author = new Model({
    firstName: 'Maciej',
    lastName: 'Konieczny',
    twitterName: 'narfdotpl'
  });

  fullNameTemplate = function() {
    var firstName, lastName;
    console.log('rendering full name template');
    firstName = author.get('firstName');
    lastName = author.get('lastName');
    return "" + firstName + " " + lastName;
  };

  twitterNameTemplate = function() {
    var twitterName;
    console.log('rendering twitter name template');
    twitterName = author.get('twitterName');
    return "(<a href='https://twitter.com/" + twitterName + "'>@" + twitterName + "</a>)";
  };

  fullNameHtml = render(fullNameTemplate);

  twitterNameHtml = render(twitterNameTemplate);

  $('#signature').append(fullNameHtml).append(twitterNameHtml);

  window.author = author;

}).call(this);
