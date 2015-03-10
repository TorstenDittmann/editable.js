 describe('Clipboard', function() {

  describe('parseContent()', function() {

    var extract = function(str) {
      var div = document.createElement('div');
      div.innerHTML = str;
      return clipboard.parseContent(div);
    };

    var extractSingleBlock = function(str) {
      return extract(str)[0]
    }


    // Copy Elements
    // -------------

    it('gets a plain text', function() {
      expect(extractSingleBlock('a')).toEqual('a');
    });

    it('trims text', function() {
      expect(extractSingleBlock(' a ')).toEqual('a');
    });

    it('keeps a <a> element with an href attribute', function() {
      expect(extractSingleBlock('<a href="http://link.com">a</a>')).toEqual('<a href="http://link.com">a</a>');
    });

    it('keeps a <strong> element', function() {
      expect(extractSingleBlock('<strong>a</strong>')).toEqual('<strong>a</strong>');
    });

    it('keeps an <em> element', function() {
      expect(extractSingleBlock('<em>a</em>')).toEqual('<em>a</em>');
    });

    it('keeps a <br> element', function() {
      expect(extractSingleBlock('a<br>b')).toEqual('a<br>b');
    });


    // Split Blocks
    // ------------

    it('creates two blocks from two paragraphs', function() {
      var blocks = extract('<p>a</p><p>b</p>');
      expect(blocks[0]).toEqual('a');
      expect(blocks[1]).toEqual('b');
    });

    it('creates two blocks from an <h1> followed by an <h2>', function() {
      var blocks = extract('<h1>a</h1><h2>b</h2>')
      expect(blocks[0]).toEqual('a');
      expect(blocks[1]).toEqual('b');
    });


    // Clean Whitespace
    // ----------------

    var checkWhitespace = function(a, b) {
      expect( escape(extractSingleBlock(a)) ).toEqual( escape(b) );
    };

    it('replaces a single &nbsp; character', function() {
      checkWhitespace('a&nbsp;b', 'a b');
    });

    it('replaces a series of &nbsp; with alternating whitespace and &nbsp;', function() {
      checkWhitespace('a&nbsp;&nbsp;&nbsp;&nbsp;b', 'a \u00A0 \u00A0b');
    });

    it('replaces a single &nbsp; character before a <span>', function() {
      checkWhitespace('a&nbsp;<span>b</span>', 'a b');
    });


    // Remove Elements
    // ---------------

    it('removes a <span> element', function() {
      expect(extractSingleBlock('<span>a</span>')).toEqual('a');
    });

    it('removes an <a> element without an href attribute', function() {
      expect(extractSingleBlock('<a>a</a>')).toEqual('a');
    });

    it('removes an <a> element with an empty href attribute', function() {
      expect(extractSingleBlock('<a href="">a</a>')).toEqual('a');
    });

    it('removes an empty <strong> element', function() {
      expect(extractSingleBlock('<strong></strong>')).toEqual(undefined);
    });

    it('removes a <strong> element with only whitespace', function() {
      expect(extractSingleBlock('<strong> </strong>')).toEqual(undefined);
    });

    it('removes an empty <strong> element but keeps its whitespace', function() {
      expect(extractSingleBlock('a<strong> </strong>b')).toEqual('a b');
    });

    it('removes an attribute from an <em> element', function() {
      expect(extractSingleBlock('<em data-something="x">a</em>')).toEqual('<em>a</em>');
    });


    // Transform Elements
    // ------------------

    it('transforms a <b> into a <strong>', function() {
      expect(extractSingleBlock('<b>a</b>')).toEqual('<strong>a</strong>');
    });


    // Escape Content
    // --------------

    it('escapes the string "<b>a</b>"', function() {
      // append the string to test as text node so the browser escapes it.
      var div = document.createElement('div');
      div.appendChild( document.createTextNode('<b>a</b>') );

      expect(clipboard.parseContent(div)[0]).toEqual('&lt;b&gt;a&lt;/b&gt;');
    });

  });
});