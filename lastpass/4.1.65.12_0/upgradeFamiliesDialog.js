var UpgradeFamiliesDialog=function(e){Dialog.call(this,e,{additionalHeaderClasses:[],dynamicHeight:!0,buttonsInsideContent:!0,title:Strings.translateString("A modern safe for today's digital family"),closeButtonEnabled:!0,hidePreviousDialogs:!0})};UpgradeFamiliesDialog.prototype=Object.create(Dialog.prototype),UpgradeFamiliesDialog.prototype.constructor=UpgradeFamiliesDialog,UpgradeFamiliesDialog.prototype.initialize=function(e){var i=this;Topics.get(Topics.REFRESH_DATA).subscribe(function(){LPProxy.isFamilyUser()&&(LPProxy.setPreferences("IntroTour",null),IntroTourData.familyOnboardingTour=familyOnboardingTour.getTourData(),i.close(),LPPlatform.openTour())}),Dialog.prototype.initialize.apply(this,arguments),function(i){e.find("#upgrade-families-spinner").hide(),document.querySelector("#dialogCloseButton").classList.remove("dialogCloseButton"),document.querySelector("#dialogCloseButton").innerHTML="&#10006;",document.querySelector("#dialogCloseButton").classList.add("family-opt-in-close"),e.find("#dialogCloseButton").bind("click",function(){localStorage.setItem("lp_families_dialog_snoozed",Date.now()+2592e5),i.close(!0),bg.sendLpImprove("families_legacy_premium_lightbox_click",{action:"remind_later"})}),e.find("#families-upgrade-postpone").bind("click",function(){localStorage.setItem("lp_families_dialog_never",!0),i.close(!0),bg.sendLpImprove("upgrade_to_families_lightbox_click",{action:"never"})}),e.find("#families-upgrade-now").bind("click",function(){UpgradeFamiliesDialog.prototype.startTrial(),bg.sendLpImprove("families_legacy_premium_lightbox_click",{action:"upgrade_now"})}),e.find("#families-upgrade-learn-more").bind("click",function(){bg.sendLpImprove("families_legacy_premium_lightbox_click",{action:"learn_more"})})}(this)},UpgradeFamiliesDialog.prototype.startTrial=function(){LPRequest.makeRequest(LPProxy.familiesOptIn,{params:{}})},UpgradeFamiliesDialog.prototype.showInProcessOverlay=function(){$("#upgrade-families-spinner").show(),$("#upgrade-families-text").hide(),$("#upgrade-families-icon").hide(),$("#families-upgrade-now").prop("disabled",!0),$("#families-upgrade-postpone").prop("disabled",!0)},UpgradeFamiliesDialog.prototype.hideInProcessOverlay=function(){$("#upgrade-families-spinner").hide(),$("#upgrade-families-text").show(),$("#upgrade-families-icon").show(),$("#families-upgrade-now").prop("disabled",!1),$("#families-upgrade-postpone").prop("disabled",!1)},UpgradeFamiliesDialog.prototype.postSetup=function(e){Dialog.prototype.postSetup.apply(this,arguments),e=e||{},e.forceAccepted&&UpgradeFamiliesDialog.prototype.startTrial()},UpgradeFamiliesDialog.prototype.close=function(e){e&&(Dialog.prototype.close.apply(this,arguments),bg.sendLpImprove("families_legacy_premium_lightbox_click",{action:"close"}))};