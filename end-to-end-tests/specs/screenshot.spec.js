var assert = require('assert');
var expect = require('chai').expect;
var waitForOncoprint = require('./specUtils').waitForOncoprint;
var goToUrlAndSetLocalStorage = require('./specUtils').goToUrlAndSetLocalStorage;

const CBIOPORTAL_URL = process.env.CBIOPORTAL_URL.replace(/\/$/, "");

function ssAssert(result, message){
    assert(result[0].isWithinMisMatchTolerance);
};

function runResultsTests(){

    it('render the oncoprint', function(){
        waitForOncoprint();
        browser.pause(2000);
        var res = browser.checkElement('#oncoprint');
        ssAssert(res);
    });

    // can't get it to pass reliably
    it.skip('igv_tab tab', function(){
        browser.click("[href='#igv_tab']");
        browser.waitForExist('#cnSegmentsFrame', 20000);
        var res = browser.checkElement('#igv_tab',{hide:['.qtip'] });
        ssAssert(res);
    });

    it('cancer type summary', function(){
        browser.click("[href='#pancancer_study_summary']");
        browser.waitForVisible('.cancer-summary-chart-container',10000);
        var res = browser.checkElement('#pancancer_study_summary', { hide:['.qtip'] });
        ssAssert(res);
    });

    it('mutex tab', function(){
        browser.click("[href='#mutex']");
        var res = browser.checkElement('#mutex',{ hide:['.qtip'] });
        ssAssert(res);
    });

    it('plots tab', function(){
        browser.click("[href='#plots']");
        browser.waitForExist('#plots-box svg',10000);
        var res = browser.checkElement('#plots', { hide:['.qtip'], misMatchTolerance:1 });
        ssAssert(res);
    });

    it.skip('mutation tab', function(){
        browser.click("[href='#mutation_details']");
        browser.waitForVisible('.borderedChart svg',20000);
        var res = browser.checkElement('#mutation_details',{hide:['.qtip'] });
        ssAssert(res);
    });

    it('coexpression tab', function(){
        browser.click("[href='#coexp']");
        browser.waitForVisible('#coexp_table_div_KRAS',10000);
        var res = browser.checkElement('#coexp',{hide:['.qtip'] });
        ssAssert(res);
    });

    it('survival tab', function(){
        browser.click("[href='#survival']");
        browser.waitForVisible('[data-test=SurvivalChart] svg',10000);
        var res = browser.checkElement('#survival',{hide:['.qtip'] });
        ssAssert(res);
    });

    it('network tab', function(){
        browser.click("[href='#network']");
        browser.waitForVisible('#cytoscapeweb canvas',20000);
        var res = browser.checkElement("#network",{hide:['.qtip','canvas'] });
        ssAssert(res);
    });

    it.skip('data_download tab', function(){
        browser.click("[href='#data_download']");
        //  browser.pause(1000);
        browser.waitForExist("#text_area_gene_alteration_freq",20000);
        browser.waitUntil(function(){ return browser.getValue("#text_area_gene_alteration_freq").length > 0 },20000);
        var res = browser.checkElement('#data_download',{hide:['.qtip'] });
        ssAssert(res);
    });

}

describe('result page screenshot tests', function(){
    before(function(){
        var url = `${CBIOPORTAL_URL}/index.do?tab_index=tab_visualize&cancer_study_list=coadread_tcga_pub&cancer_study_id=coadread_tcga_pub&genetic_profile_ids_PROFILE_MUTATION_EXTENDED=coadread_tcga_pub_mutations&genetic_profile_ids_PROFILE_COPY_NUMBER_ALTERATION=coadread_tcga_pub_gistic&Z_SCORE_THRESHOLD=2.0&case_set_id=coadread_tcga_pub_nonhypermut&case_ids=&gene_list=KRAS+NRAS+BRAF&gene_set_choice=user-defined-list&Action=Submit&show_samples=false&`;
        goToUrlAndSetLocalStorage(url);
    });

    runResultsTests()


});

describe('patient view page screenshot test', function(){
    before(function(){
        var url = `${CBIOPORTAL_URL}/case.do#/patient?studyId=lgg_ucsf_2014&caseId=P04`;
        goToUrlAndSetLocalStorage(url);
    });

	it('patient view lgg_ucsf_2014 P04', function() {
        // find oncokb image
        var oncokbIndicator = $('[data-test="oncogenic-icon-image"]');
        oncokbIndicator.waitForExist(30000);
        // find vaf plot
        var vafPlot = $('.vafPlot');
        vafPlot.waitForExist(30000);

        var res = browser.checkElement('#mainColumn', {hide:['.qtip'] });
        ssAssert(res);
	});
});

describe('study view screenshot test', function(){
    before(function(){
        var url = `${CBIOPORTAL_URL}/study.do?cancer_study_id=lgg_ucsf_2014`;
        goToUrlAndSetLocalStorage(url);
    });

	it.skip('study view lgg_ucsf_2014', function() {
        // assume that when mutated genes header is loaded the full page is
        // done loading
        var mutatedGenesHeader = $('#chart-new-mutated_genes-chart-header');
        mutatedGenesHeader.waitForExist(30000);

        // give charts time to render
        browser.setViewportSize({ height: 1600, width: 1000 })
        browser.pause(5000);

        var res = browser.checkElement('#page_wrapper_table', {hide:['.qtip'] });
        ssAssert(res);
	});
});

describe('result page tabs, loading from session id', function(){
    before(function(){
        var url = `${CBIOPORTAL_URL}/index.do?session_id=596f9fa3498e5df2e292bdfd`;
        goToUrlAndSetLocalStorage(url);
    });

    runResultsTests();

});
