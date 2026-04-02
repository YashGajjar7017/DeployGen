import User from '../models/User.js';

export const getPremiumFeaturesHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    const isPremium = user && user.isPremiumValid();

    const features = {
      starter: {
        name: 'Starter',
        price: { monthly: 9.99, yearly: 99.99 },
        features: [
          'Up to 5 projects',
          'Basic app selection',
          'Email support',
          'Community forum access',
          'Monthly updates'
        ]
      },
      professional: {
        name: 'Professional',
        price: { monthly: 29.99, yearly: 299.99 },
        features: [
          'Unlimited projects',
          'Advanced app selection',
          'Priority email support',
          'Custom configurations',
          'Team collaboration (up to 5)',
          'Advanced analytics',
          'Weekly updates',
          'API access'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        price: { monthly: 99.99, yearly: 999.99 },
        features: [
          'Unlimited everything',
          'Dedicated account manager',
          '24/7 phone & email support',
          'Custom integrations',
          'Unlimited team members',
          'Advanced security features',
          'Real-time analytics',
          'Priority development queue',
          'Annual training sessions'
        ]
      }
    };

    res.status(200).json({
      success: true,
      userIsPremium: isPremium,
      userPlan: user?.premium_plan || 'free',
      premiumExpiry: user?.premium_expiry,
      features
    });
  } catch (error) {
    console.error('Get premium features error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch premium features'
    });
  }
};

/**
 * Check current subscription status
 * GET /api/premium/status
 */
export const getPremiumStatusHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    const isPremium = user && user.isPremiumValid();

    res.status(200).json({
      success: true,
      isPremium,
      plan: user?.premium_plan || 'free',
      expiryDate: user?.premium_expiry,
      daysRemaining: isPremium ? Math.ceil((new Date(user.premium_expiry) - new Date()) / (1000 * 60 * 60 * 24)) : 0
    });
  } catch (error) {
    console.error('Get premium status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch premium status'
    });
  }
};

/**
 * Get premium services information
 * GET /api/premium/services
 */
export const getPremiumServicesHandler = async (req, res) => {
  try {
    const services = [
      {
        title: 'Priority Support',
        description: 'Get faster response times and dedicated support from our expert team',
        icon: 'Clock',
        benefits: [
          'Response within 4 hours',
          'Dedicated support channel',
          'Priority issue resolution',
          'Quarterly check-ins'
        ]
      },
      {
        title: 'Advanced Security',
        description: 'Enterprise-grade encryption and security features for your peace of mind',
        icon: 'Lock',
        benefits: [
          'End-to-end encryption',
          'Advanced authentication options',
          'Audit logs',
          'IP whitelisting'
        ]
      },
      {
        title: 'Analytics Dashboard',
        description: 'Detailed insights into your app installations and usage patterns',
        icon: 'BarChart3',
        benefits: [
          'Real-time analytics',
          'Custom reports',
          'Installation history',
          'Usage statistics'
        ]
      },
      {
        title: 'Custom Configurations',
        description: 'Create and manage custom app sets tailored to your specific needs',
        icon: 'Zap',
        benefits: [
          'Save app configurations',
          'Team templates',
          'Version control',
          'One-click deployment'
        ]
      }
    ];

    res.status(200).json({
      success: true,
      services
    });
  } catch (error) {
    console.error('Get premium services error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch premium services'
    });
  }
};

/**
 * Upgrade user subscription
 * POST /api/premium/upgrade
 */
export const upgradeSubscriptionHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { plan, billingCycle } = req.body;

    if (!['starter', 'professional', 'enterprise'].includes(plan)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Calculate expiry date (30 days for monthly, 365 days for yearly)
    const daysToAdd = billingCycle === 'yearly' ? 365 : 30;
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + daysToAdd);

    user.premium_plan = plan;
    user.premium_expiry = expiryDate;
    await user.save();

    res.status(200).json({
      success: true,
      message: `Upgraded to ${plan} plan`,
      plan,
      expiryDate,
      billingCycle
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to upgrade subscription'
    });
  }
};

/**
 * Cancel premium subscription
 * POST /api/premium/cancel
 */
export const cancelSubscriptionHandler = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const user = await User.findById(req.user.id);
    
    user.premium_plan = 'free';
    user.premium_expiry = null;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to cancel subscription'
    });
  }
};

/**
 * Get pricing information
 * GET /api/premium/pricing
 */
export const getPricingHandler = async (req, res) => {
  try {
    const pricing = {
      starter: {
        name: 'Starter',
        description: 'Perfect for beginners',
        monthly: 9.99,
        yearly: 99.99,
        features: [
          'Up to 5 projects',
          'Basic app selection',
          'Email support',
          'Community forum access',
          'Monthly updates'
        ]
      },
      professional: {
        name: 'Professional',
        description: 'For serious developers',
        monthly: 29.99,
        yearly: 299.99,
        features: [
          'Unlimited projects',
          'Advanced app selection',
          'Priority email support',
          'Custom configurations',
          'Team collaboration (up to 5)',
          'Advanced analytics',
          'Weekly updates',
          'API access'
        ]
      },
      enterprise: {
        name: 'Enterprise',
        description: 'For large teams',
        monthly: 99.99,
        yearly: 999.99,
        features: [
          'Unlimited everything',
          'Dedicated account manager',
          '24/7 phone & email support',
          'Custom integrations',
          'Unlimited team members',
          'Advanced security features',
          'Real-time analytics',
          'Priority development queue',
          'Annual training sessions'
        ]
      }
    };

    res.status(200).json({
      success: true,
      pricing,
      discount: {
        yearly: '17%',
        message: 'Save 17% when you switch to yearly billing'
      }
    });
  } catch (error) {
    console.error('Get pricing error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch pricing'
    });
  }
};
